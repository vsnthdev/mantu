/*
 *  This file deals with different channels on Discord.
 *  Created On 06 January 2021
 */

import { config } from '../../config/index.js'
import { client } from './index.js'

const getChannel = async id => {
    const guild = await client.guilds.cache.get(config.get('discord.server'))

    return guild.channels.cache.get(id)
}

export default {
    getChannel,
}
