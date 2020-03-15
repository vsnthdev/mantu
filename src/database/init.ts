// This file will initialize the database with the required information

import Conf from 'conf'
import Discord from 'discord.js'
import moment from 'moment'
import fetch from 'node-fetch'

import logger from '../logger'
import { ConfigImpl } from '../config'
import { forEach } from '../utilities/loops'
import daCashTranslate from '../database/cashTranslate'
import daCountries from '../database/countries'
import daMembers from '../database/members'
import diMembers from '../discord/members'

async function initMembers(config: Conf<ConfigImpl>): Promise<void> {
    // get all members from my discord server
    const discordMembers = await diMembers.getAllMembers(config)

    // get all the users from the database
    const membersInDB = await daMembers.getAllMembers()
    const discordMembersId: string[] = []

    // loop through all the members from Discord and add new ones
    // while updating existing one's names
    await forEach(discordMembers, async (member: Discord.GuildMember) => {
        // Check if the member exists in our database
        const exists = await daMembers.memberExists(member.user.id)
        discordMembersId.push(member.user.id)
        
        if (exists == false) {
            // Add the user to our database
            logger.verbose(`Adding user: ${member.displayName} to the database`)
            await daMembers.addUserToDatabase(member)
            // TODO: Say hello to the user!
        } else {
            // update their names in case it has been changed
            await daMembers.updateDisplayName(member.user.id, member.displayName)
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
            daMembers.deleteUserFromDatabase(member.id)
        }
    })
}

async function initCountries(): Promise<void> {
    const country = await daCountries.getCountryByName('India')
    if (!country) {
        // send a HTTP request to restcountries.eu to get information
        // about all countries
        const countryRestInfo = await (await fetch('https://restcountries.eu/rest/v2/all')).json()
        
        // loop through all the countries and add them to the database
        await forEach(countryRestInfo, async (country) => {
            await daCountries.addCountry(country)
        })
    }
}

async function initCashTranslate(config: Conf<any>): Promise<void> {
    const lastFetch = config.get('fixer.lastFetch')
    const todayId = parseInt(moment().format('YYYYMMDD'))
    if (todayId > lastFetch) {
        const cashTranslationData = await (await fetch(`http://data.fixer.io/api/latest&access_key=${config.get('fixer').token}`)).json()
        
        // handle fixer api errors
        if (cashTranslationData.success == false) {
            logger.error(`Failed to connect to fixer.io api due to: "${cashTranslationData.error.info}"`, 5)
        } else {
            // now that we have the cash translation data
            // let's delete everything and freshly save it in our database
            await daCashTranslate.resetCashTranslation()
            for (const code in cashTranslationData.rates) {
                const value = cashTranslationData.rates[code]
                
                // let's add to our database
                await daCashTranslate.addCashTranslation(code, value)
            }

            config.set('fixer.lastFetch', parseInt(moment().format('YYYYMMDD')))
            logger.verbose('Finished fetching cash translation data from fixer.io')
        }
    }
}

export default async function init(config: Conf<ConfigImpl>): Promise<void> {
    await initMembers(config)
    await initCountries()
    await initCashTranslate(config)
    logger.info('The database has been synchronized')
}