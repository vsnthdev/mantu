// This file will respond with the user's last active time

import Discord, { GuildMember } from 'discord.js'
import moment from 'moment'

import database from '../database'
import { forEach } from '../tasks/cleanup'

export default async function respond(message: Discord.Message): Promise<void> {
    // get the second mention and myself
    const myself = message.mentions.members.first()

    // loop through all the members
    const members = Array.from(message.mentions.members.values())
    
    // move myself from the list first!
    members.shift()

    await forEach(members, async (member: GuildMember) => {
        // get the last activity from database
        const databaseInfo = await database.queries.getMember(member.user.id)

        // create a rich embed
        const response = new Discord.RichEmbed()
            .setColor('0x006cff')
            .setTitle(`Activity information for ${member.displayName}`)
            .setThumbnail(member.user.avatarURL)
            .setAuthor(myself.displayName, myself.user.avatarURL)
            .addField('ID', member.user.id)
            .addField('Last Activity', moment(databaseInfo.lastActive, 'x').fromNow())

        // send the response
        message.channel.send(response)
    })
}