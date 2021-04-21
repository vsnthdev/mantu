/*
 *  This file deals with different channels on Discord.
 *  Created On 06 January 2021
 */

import guilds from './guilds.js'

const get = async id => {
    const guild = await guilds.getGuild()

    return guild.channels.cache.get(id)
}

const createGroup = async (name, position = 0) => {
    const guild = await guilds.getGuild()
    return await guild.channels.create(name, {
        position,
        type: 'category',
    })
}

const createChannel = async ({ name, parent, isPrivate, type }) => {
    const guild = await guilds.getGuild()
    const channel = await guild.channels.create(name, {
        parent,
        type: type,
    })

    if (isPrivate) {
        await channel.overwritePermissions([
            {
                id: guild.roles.everyone.id,
                deny: ['VIEW_CHANNEL'],
            },
            {
                id: isPrivate.id,
                allow: ['VIEW_CHANNEL'],
            },
        ])
    }

    return channel
}

export default {
    get,
    createGroup,
    createChannel,
}
