// This file will cleanup the Discord server
// and send people a DM notifying that they have been kicked
// due to inactivity.

import Conf from 'conf'
import Discord from 'discord.js'
import moment from 'moment'

import { forCollection, forEach } from '../utilities/loops'
import { setInterval } from '../utilities/time'
import { ConfigImpl } from '../config'
import logger from '../logger'
import getTemplate from '../templates'
import logging from '../discord/logging'
import events from '../discord/events'
import daMembers, { Member } from '../database/members'
import diMembers from '../discord/members'
import { getRandomEmoji } from '../discord/discord'

async function updateActivity(oldPresence: Discord.Presence, newPresence: Discord.Presence): Promise<void> {
    // check if the user came online
    if (newPresence.status === 'offline' || newPresence.status == 'online') {
        // update the database accordingly!
        await daMembers.updateLastActivity(newPresence.user.id)

        // just so that we know the database was changed
        if (newPresence.status == 'online') {
            logger.verbose(`${newPresence.member.displayName} has come online.`)
        } else {
            logger.verbose(`${newPresence.member.displayName} went ${newPresence.status}.`)
        }
    }
}

async function updateUsersInDB(oldMember: Discord.GuildMember, newMember: Discord.GuildMember): Promise<void> {
    // determine if the Member role was added or removed
    const roles: string[] = []
    await forCollection(newMember.roles.cache, (role: Discord.Role) => {
        roles.push(role.name)
    })

    if (roles.includes('Member') == true) {
        const exists = await daMembers.memberExists(newMember.id)
        if (exists == false) {
            await daMembers.addUserToDatabase(newMember)
            logger.verbose(`${newMember.displayName} has been added to the database.`)
        } else {
            await daMembers.updateDisplayName(newMember.id, newMember.displayName)
            logger.verbose(`${oldMember.displayName} has changed nickname to ${newMember.displayName}`)
        }
    } else {
        await daMembers.deleteUserFromDatabase(newMember.user.id)
        logger.verbose(`${oldMember.displayName} is no longer a member.`)
    }
}

async function kickUserIfInactive(member: Discord.GuildMember, memberInDB: Member, config: Conf<ConfigImpl>): Promise<boolean> {
    // calculate the time of lastActivity
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
        await daMembers.deleteUserFromDatabase(member.id)

        // send this instance to server logs
        await logging.sendServerLog(`${getRandomEmoji(true)} ${member.displayName} has been kicked due to inactivity for 20+ days. ${(memberDMed == false) ? 'But, couldn\'t send him the direct message.' : '' }`, config)
    }

    return false
}

export default async function cleanUpServer(config: Conf<ConfigImpl>): Promise<void> {
    // hookup the required events
    events.presenceChanged(updateActivity)
    events.guildMemberUpdate(updateUsersInDB)

    // for every hour, check if there are are people that
    // should be kick due to inactivity, if yes then run the function
    setInterval(((1000 * 60) * 60), async () => {
        const membersInDiscord = await diMembers.getAllMembers(config)
        
        // loop through all the members in discord
        await forEach(membersInDiscord, async (member: Discord.GuildMember) => {
            // get the member's database entry
            const memberInDB = await daMembers.getMember(member.id)
            await kickUserIfInactive(member, memberInDB, config)
        })
    })
}