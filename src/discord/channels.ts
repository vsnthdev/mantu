// This file will deal with all the channels in the server

import Discord from 'discord.js'
import Conf from 'conf'

import client from './discord'
import { ConfigImpl } from '../config'

async function getHelpChannel(config: Conf<ConfigImpl>): Promise<Discord.TextChannel> {
    const guild = client.guilds.cache.first()
    return guild.channels.cache.find(channel => channel.id == config.get('channels').help) as Discord.TextChannel
}

export default {
    getHelpChannel
}