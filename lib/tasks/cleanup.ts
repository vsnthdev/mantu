// This file will cleanup the Discord server
// and send people a DM notifying that they have been kicked
// due to inactivity.

import Conf from 'conf'
import Discord from 'discord.js'
import moment from 'moment'

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
    const membersInDB = await database.queries.getAllMembers()
    let discordMembersId: string[] = []

    // loop through all the members from Discord and add new ones
    // while updating existing one's names
    await forEach(members, async (member: Discord.GuildMember) => {
        // Check if the member exists in our database
        let exists = await database.queries.memberExists(member.user.id)
        discordMembersId.push(member.user.id)
        
        if (exists == false) {
            // Add the user to our database
            logger.verbose(`Adding user: ${member.displayName} to the database`)
            database.queries.addUserToDatabase(member)
        } else {
            // check if he should be kicked due to inactivity
            const kicked = await kickUserIfInactive(member, membersInDB, config)

            // update their names in case it has been changed
            if (kicked == false) await database.queries.updateDisplayName(member.user.id, member.displayName)
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
            database.queries.deleteUserFromDatabase(member.id)
        }
    })
}

async function updateActivity(oldMember: Discord.GuildMember, newMember: Discord.GuildMember): Promise<void> {
    // check if the user came online
    if (newMember.presence.status === 'offline' || newMember.presence.status == 'online') {
        // update the database accordingly!
        await database.queries.updateLastActivity(newMember.user.id)
    }
}

async function updateUsersInDB(oldMember: Discord.GuildMember, newMember: Discord.GuildMember): Promise<void> {
    // determine if the Member role was added or removed
    let roles: string[] = []
    await forCollection(newMember.roles, (role: Discord.Role) => {
        roles.push(role.name)
    })

    if (roles.includes('Member') == true) {
        const exists = await database.queries.memberExists(newMember.id)
        if (exists == false) {
            await database.queries.addUserToDatabase(newMember)
        } else {
            await database.queries.updateDisplayName(newMember.id, newMember.displayName)
        }
    } else {
        await database.queries.deleteUserFromDatabase(newMember.user.id)
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
        await database.queries.deleteUserFromDatabase(member.id)

        // send this instance to server logs
        await discord.logging.sendServerLog(`:recycle: **<@${member.id}> has been kicked due to inactivity for 20+ days. ${(memberDMed == false) ? 'But, couldn\'t send him the direct message.' : '' }**`, config)
    }

    return false
}