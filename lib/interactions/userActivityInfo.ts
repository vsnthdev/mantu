// This file will respond with the user's last active time

import Discord from 'discord.js'
import moment from 'moment'

import database from '../database'

export default async function respond(message: Discord.Message): Promise<void> {
    // get the second mention and myself
    const targetUser = Array.from(message.mentions.members.values())[1] as Discord.GuildMember
    const myself = message.mentions.members.first()

    // get the last activity from database
    const databaseInfo = await database.queries.getMember(targetUser.user.id)

    // create a rich embed
    const response = new Discord.RichEmbed()
        .setColor('0x006cff')
        .setTitle(`Activity information for ${targetUser.displayName}`)
        .setThumbnail(targetUser.user.avatarURL)
        .setAuthor(myself.displayName, myself.user.avatarURL)
        .addField('ID', targetUser.user.id)
        .addField('Last Activity', moment(databaseInfo.lastActive, 'x').fromNow())

    // send the response
    message.channel.send(response)
}