/* eslint-disable indent */
/*
 *  This file interfaces with roles on a Discord server.
 *  Created On 25 September 2020
 */

import { config } from '../../config/index.js'
import logger from '../../logger/discord.js'
import { client } from './index.js'

const getRoleByName = async name => {
    const guild = await client.guilds.cache.get(config.get('discord.server'))
    const role = await guild.roles.cache.find(role => role.name === name)

    if (!role)
        logger.error(`A role with name ${name} does not exist on the server`, 2)

    return role
}

export default {
    getRoleByName,
}
