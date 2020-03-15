// This file will handle messages sent to the channels.log

import Discord from 'discord.js'
import Conf from 'conf'

import { ConfigImpl } from '../config'
import client from './discord'

async function sendServerLog(content, config: Conf<ConfigImpl>): Promise<void> {
    const serverLog = await client.channels.cache.find((channel) => channel.id == config.get('channels').log) as Discord.TextChannel
    serverLog.send(content)
}

async function sendDiscordError(e: Discord.DiscordAPIError, author: Discord.GuildMember, channel: Discord.TextChannel, config: Conf<any>): Promise<void> {
    const content = new Discord.MessageEmbed()
        .setColor(config.get('embedColor'))
        .setTitle(`${e.name} occurred in mantu`)
        .setTimestamp()
        .addField('Name', e.name, true)
        .addField('Code', e.code, true)
        .addField('Action', e.method, true)
        .addField('Triggered By', `<@${author.id}>`, true)
        .addField('On Channel', `<#${channel.id}>`, true)
        .addField('Message', e.message)
    
    await sendServerLog(content, config)
}

export default {
    sendServerLog,
    sendDiscordError
}