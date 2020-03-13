// This file will respond with the user's last active time

import Discord from 'discord.js'
import moment from 'moment'
import Conf from 'conf'

import database from '../database'
import { forEach } from '../tasks/cleanup'
import { setTitleCase } from './setCountry'

export default async function respond(message: Discord.Message, config: Conf<any>): Promise<boolean> {
    // loop through all the members
    const members = Array.from(message.mentions.members.values())

    await forEach(members, async (member: Discord.GuildMember) => {
        // check if the provided role is a member
        if (!member.roles.find(r => r.name === 'Member')) {
            // as this member doesn't have a member role, he/she/it won't be in the database
            // in which case we simply tell the user about it
            message.channel.send(`${member.displayName} doesn't have a "Member" role, so ${member.displayName} isn't tracked my mantu.`)
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