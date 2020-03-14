// This file will respond with the user's last active time

import Discord, { GuildMember } from 'discord.js'
import moment from 'moment'
import Conf from 'conf'

import database from '../database'
import { forEach } from '../tasks/cleanup'
import { setTitleCase } from './setCountry'
import { ConfigImpl } from '../config'
import roles from '../discord/roles'
import generic from '../discord/generic'

export default async function respond(message: Discord.Message, config: Conf<ConfigImpl>): Promise<boolean> {
    // loop through all the members
    let members: GuildMember[] = []

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
            message.channel.send(`:beetle: **${member.displayName} doesn't have a ${(await roles.getBaseRole(config)).name} role, so ${member.displayName} isn't tracked my me.**`)
        } else {
            // get the last activity from database
            const databaseInfo = await database.queries.members.getMember(member.user.id)

            // create a rich embed
            const response = new Discord.RichEmbed()
                .setColor(config.get('embedColor'))
                .setTitle(`Activity information for ${member.displayName}`)
                .setThumbnail(member.user.avatarURL)
                .addField('ID', member.user.id, true)
                .addField('Last Activity', moment(databaseInfo.lastActive, 'x').fromNow(), true)
                .addField('Timezone', (databaseInfo.timezone) ? databaseInfo.timezone : 'Unknown', true)
                .addField('Country', (databaseInfo.country) ? setTitleCase(databaseInfo.country) : 'Unknown')

            // send the response
            message.channel.send(response)
        }
    })

    return true
}