// This file will cleanup the Discord server
// and send people a DM notifying that they have been kicked
// due to inactivity.

import Conf from 'conf'
import Discord from 'discord.js'
import moment from 'moment'
import fetch from 'node-fetch'

import discord from '../discord'
import database from '../database'
import logger from '../logger'
import getTemplate from '../templates'

export async function forEach(array: any[], callback): Promise<void> {
    for (let index = 0; index < array.length; index++) {
        await callback(array[index], index, array)
    }
}

export async function forCollection(collection: Discord.Collection<any, any>, callback): Promise<void> {
    collection.forEach(async (value, key, map) => {
        await callback(value, key, map)
    })
}

export default function cleanUpServer(config): () => Promise<any> {
    return async function() {
        await syncDatabase(config)
        logger.info('The database has been synchronized')

        // hookup the required events
        discord.events.presenceChanged(updateActivity)
        discord.events.guildUpdated(updateUsersInDB)
    }
}


async function syncDatabase(config: Conf<any>): Promise<void> {
    // get all members from my discord server
    const members = await discord.members.getAllMembers(config)

    // get all the users from the database
    const membersInDB = await database.queries.members.getAllMembers()
    let discordMembersId: string[] = []

    // loop through all the members from Discord and add new ones
    // while updating existing one's names
    await forEach(members, async (member: Discord.GuildMember) => {
        // Check if the member exists in our database
        let exists = await database.queries.members.memberExists(member.user.id)
        discordMembersId.push(member.user.id)
        
        if (exists == false) {
            // Add the user to our database
            logger.verbose(`Adding user: ${member.displayName} to the database`)
            database.queries.members.addUserToDatabase(member)
        } else {
            // check if he should be kicked due to inactivity
            const kicked = await kickUserIfInactive(member, membersInDB, config)

            // update their names in case it has been changed
            if (kicked == false) await database.queries.members.updateDisplayName(member.user.id, member.displayName)
        }
    })

    // loop through all the members in database and delete non-existent ones
    await forEach(membersInDB, async (member) => {
        // Check if the member exists in Discord
        const exists = discordMembersId.includes(member.id)
        if (exists == false) {
            // delete the user from our database as he no longer is a member
            // on the discord server
            logger.verbose(`Removing user: ${member.name} from the database.`)
            database.queries.members.deleteUserFromDatabase(member.id)
        }
    })

    // TODO: Move this function to a different place which is generic
    // check if we can get an example country
    const country = await database.queries.countries.getCountryByName('India')
    if (!country) {
        // send a HTTP request to restcountries.eu to get information
        // about all countries
        const countryRestInfo = await (await fetch('https://restcountries.eu/rest/v2/all')).json()
        
        // loop through all the countries and add them to the database
        await forEach(countryRestInfo, async (country) => {
            await database.queries.countries.addCountry(country)
        })
    }

    // fetch the currency convertor information once per day
    const lastFetch = parseInt(config.get('fixer.lastFetch'))
    const todayId = parseInt(moment().format('YYYYMMDD'))
    if (todayId > lastFetch) {
        const cashTranslationData = await (await fetch(`http://data.fixer.io/api/latest&access_key=${config.get('fixer.token')}`)).json()
        
        // handle fixer api errors
        if (cashTranslationData.success == false) {
            logger.error(`Failed to connect to fixer.io api due to: "${cashTranslationData.error.info}"`, 5)
        } else {
            // now that we have the cash translation data
            // let's delete everything and freshly save it in our database
            await database.queries.cashTranslate.resetCashTranslation()
            for (let code in cashTranslationData.rates) {
                const value = cashTranslationData.rates[code]
                
                // let's add to our database
                await database.queries.cashTranslate.addCashTranslation(code, value)
            }

            config.set('fixer.lastFetch', parseInt(moment().format('YYYYMMDD')))
            logger.verbose('Finished fetching cash translation data from fixer.io')
        }
    }
}

async function updateActivity(oldMember: Discord.GuildMember, newMember: Discord.GuildMember): Promise<void> {
    // check if the user came online
    if (newMember.presence.status === 'offline' || newMember.presence.status == 'online') {
        // update the database accordingly!
        await database.queries.members.updateLastActivity(newMember.user.id)
    }
}

async function updateUsersInDB(oldMember: Discord.GuildMember, newMember: Discord.GuildMember): Promise<void> {
    // determine if the Member role was added or removed
    let roles: string[] = []
    await forCollection(newMember.roles, (role: Discord.Role) => {
        roles.push(role.name)
    })

    if (roles.includes('Member') == true) {
        const exists = await database.queries.members.memberExists(newMember.id)
        if (exists == false) {
            await database.queries.members.addUserToDatabase(newMember)
        } else {
            await database.queries.members.updateDisplayName(newMember.id, newMember.displayName)
        }
    } else {
        await database.queries.members.deleteUserFromDatabase(newMember.user.id)
    }
}

async function kickUserIfInactive(member: Discord.GuildMember, members: Array<any>, config: Conf<any>): Promise<boolean> {
    // get him in the database
    const memberInDB = members.find((memberInDB) => memberInDB.id == member.id)
    const daysAgo = moment().diff(moment(memberInDB.lastActive, 'x'), 'days')

    // // check if he/she is 20 days older
    if (daysAgo >= 20) {
        // get the DM message template
        const template = await getTemplate('inactiveKick')

        // try to send a DM
        let memberDMed = false
        try {
            const channel = await member.createDM()
            await channel.send(template)
            memberDMed = true
        } catch(e) {
            logger.warning(`Failed to send DM to ${member.displayName} before kicking.`)
        }

        // kick the member
        await member.kick('Inactive for 20+ days.')
        await database.queries.members.deleteUserFromDatabase(member.id)

        // send this instance to server logs
        await discord.logging.sendServerLog(`:recycle: **${member.displayName} has been kicked due to inactivity for 20+ days. ${(memberDMed == false) ? 'But, couldn\'t send him the direct message.' : '' }**`, config)
    }

    return false
}