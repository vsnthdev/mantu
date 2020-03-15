// This file will respond with the user's last active time

import Discord, { GuildMember } from 'discord.js'
import moment from 'moment'
import Conf from 'conf'

import daMembers from '../database/members'
import { forEach, forCollection } from '../utilities/loops'
import { setTitleCase } from './setCountry'
import { ConfigImpl } from '../config'
import diRoles from '../discord/roles'
import generic from '../discord/generic'

// onlyModerators() will ensures only mods can access the commands
export async function onlyModerators(message: Discord.Message, config: Conf<ConfigImpl>): Promise<boolean> {
    const mods = config.get('roles').moderators
    let giveAccess = false
    
    // loop through all the mod roles
    await forEach(mods, async (roleId: string) => {
        const roleExists = message.member.roles.find(role => role.id == roleId)
        if (roleExists) {
            giveAccess = true
        }
    })

    // return the giveAccess variable
    return giveAccess
}

export default async function respond(command: string, message: Discord.Message, config: Conf<ConfigImpl>): Promise<boolean> {
    // loop through all the members
    let members: GuildMember[] = []

    // check if the command was only to see his/her only info
    if (command == 'info') {
        members.push(message.member)
    } else {
        // only allow mods to access this command
        const access = await onlyModerators(message, config)
        if (access == false) {
            message.channel.send(':beetle: **You don\'t have access to this command.** :person_shrugging:')
            return true
        }
    }

    // determine if we have received a list of IDs or mentions
    const parsed = message.content.split(' ')
    
    // loop through the parsed and check if there were any IDs
    await forEach(parsed, async (word: string) => {
        if (isNaN(parseInt(word)) == false && word.length == 18) {
            // get the member by id
            const member = await generic.getAnyoneById(word)
            if (member) members.push(member)
        }
    })

    // get members from mentions
    members = members.concat(Array.from(message.mentions.members.values()))

    await forEach(members, async (member: Discord.GuildMember) => {
        // check if the provided role is a member
        if (!member.roles.find(r => r.id === config.get('roles').base)) {
            // as this member doesn't have a member role, he/she/it won't be in the database
            // in which case we simply tell the user about it
            message.channel.send(`:beetle: **${member.displayName} doesn't have a ${(await diRoles.getBaseRole(config)).name} role, so ${member.displayName} isn't tracked my me.**`)
        } else {
            // get the last activity from database
            const databaseInfo = await daMembers.getMember(member.user.id)

            // get all of his/her roles
            const roles: string[] = []
            const baseRoleName = (await diRoles.getBaseRole(config)).name
            await forCollection(member.roles, async (role: Discord.Role) => {
                if (role.name !== '@everyone' && role.name !== baseRoleName) {
                    roles.push(`<@&${role.id}>`)
                }
            })

            // create a rich embed
            const response = new Discord.RichEmbed()
                .setColor(config.get('embedColor'))
                .setTitle(`Activity information for ${member.displayName}`)
                .setThumbnail(member.user.avatarURL)
                .addField('Last Activity', moment(databaseInfo.lastActive, 'x').fromNow(), true)
                .addField('Timezone', (databaseInfo.timezone) ? databaseInfo.timezone : 'Unknown', true)
                .addField('Country', (databaseInfo.country) ? setTitleCase(databaseInfo.country) : 'Unknown', true)
                .addField('ID', member.user.id, false)
                .addField('Roles', roles.join(' '), false)

            // send the response
            message.channel.send(response)
        }
    })

    return true
}