// This file will respond with the user's last active time

import Discord, { GuildMember } from 'discord.js'
import moment from 'moment'
import Conf from 'conf'

import daMembers from '../../database/members'
import { forEach, forCollection } from '../../utilities/loops'
import { setTitleCase } from '../conversion/country'
import { ConfigImpl, appInfo } from '../../config'
import diRoles from '../../discord/roles'
import diGeneric from '../../discord/generic'
import diModerators from '../../discord/moderators'
import { sendMessage, getRandomEmoji } from '../../discord/discord'

export default async function respond(command: string, message: Discord.Message, config: Conf<ConfigImpl>): Promise<boolean> {
    // loop through all the members
    let members: GuildMember[] = []

    // check if the command was only to see his/her only info
    if (command == 'info') {
        members.push(message.member)
    } else {
        // only allow mods to access this command
        const access = await diModerators.onlyModerators(message, config)
        if (access == false) return false
    }

    // determine if we have received a list of IDs or mentions
    const parsed = message.content.split(' ')
    
    // loop through the parsed and check if there were any IDs
    await forEach(parsed, async (word: string) => {
        if (isNaN(parseInt(word)) == false && word.length == 18) {
            // get the member by id
            const member = await diGeneric.getAnyoneById(word)
            if (member) members.push(member)
        }
    })

    // get members from mentions
    members = members.concat(Array.from(message.mentions.members.values()))

    await forEach(members, async (member: Discord.GuildMember) => {
        // check if the provided role is a member
        if (!member.roles.cache.find(r => r.id === config.get('roles').base)) {
            // as this member doesn't have a member role, he/she/it won't be in the database
            // in which case we simply tell the user about it
            sendMessage(`${getRandomEmoji(false)} ${member.displayName} doesn't have a ${(await diRoles.getBaseRole(config)).name} role, so ${member.displayName} isn't tracked my me.`, message.channel)
        } else {
            // get the last activity from database
            const databaseInfo = await daMembers.getMember(member.user.id)

            // get all of his/her roles
            const roles: string[] = []
            const baseRole = await diRoles.getBaseRole(config)
            await forCollection(member.roles.cache, async (role: Discord.Role) => {
                if (role.name !== '@everyone' && role.name !== baseRole.name) {
                    roles.push(`<@&${role.id}>`)
                }
            })

            // if there are no addition roles, simply add back the member role
            if (roles.length == 0) {
                roles.push(`<@&${baseRole.id}>`)
            }

            // create a rich embed
            const response = new Discord.MessageEmbed()
                .setColor(member.displayColor)
                .setTitle(`Activity information for ${member.displayName}`)
                .setAuthor(message.member.displayName, message.author.displayAvatarURL({
                    dynamic: true,
                    format: 'webp',
                    size: 256
                }))
                .setThumbnail(member.user.displayAvatarURL({
                    dynamic: true,
                    format: 'webp',
                    size: 512
                }))
                .addField('Last Activity', moment(databaseInfo.lastActive, 'x').fromNow(), true)
                .addField('Timezone', (databaseInfo.timezone) ? databaseInfo.timezone : 'Unknown', true)
                .addField('Country', (databaseInfo.country) ? setTitleCase(databaseInfo.country) : 'Unknown', true)
                .addField('ID', member.user.id, false)
                .addField('Roles', roles.join(' '), false)
                .setTimestamp()
                .setFooter(`mantu v${appInfo.version}`)

            // send the response
            sendMessage(response, message.channel)
        }
    })

    return true
}