/*
 *  This file deals with different channels on Discord.
 *  Created On 06 January 2021
 */

import guilds from './guilds.js'

const getChannel = async id => {
    const guild = await guilds.getGuild()

    return guild.channels.cache.get(id)
}

export default {
    getChannel,
}
