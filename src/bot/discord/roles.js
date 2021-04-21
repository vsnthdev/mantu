/* eslint-disable indent */
/*
 *  This file interfaces with roles on a Discord server.
 *  Created On 25 September 2020
 */

import logger from '../../logger/discord.js'
import guilds from './guilds.js'

const get = async id => {
    const guild = await guilds.getGuild()
    return await guild.roles.cache.get(id)
}

const getRoleByName = async name => {
    const guild = await guilds.getGuild()

    const role = await guild.roles.cache.find(role => role.name === name)

    if (!role)
        logger.error(`A role with name ${name} does not exist on the server`, 2)

    return role
}

const createNewRole = async (name, color, reason) => {
    const guild = await guilds.getGuild()
    return await guild.roles.create({
        data: {
            name,
            color,
        },
        reason,
    })
}

export default {
    get,
    getRoleByName,
    createNewRole,
}
