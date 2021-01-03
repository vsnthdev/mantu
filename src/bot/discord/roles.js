/*
 *  This file interfaces with roles on a Discord server.
 *  Created On 25 September 2020
 */

import config from '../../config/index.js'
import logger from '../../logger/discord.js'
import { client } from './index.js'

const getRole = async name => {
    const guild = client.guilds.cache.first()
    const baseRole = guild.roles.cache.find(
        role => role.id === config.get(`discord.roles.${name}`),
    )
    if (baseRole) {
        return baseRole
    } else {
        logger.error(
            `A role with ID ${config.get(
                `discord.role.${name}`,
            )}:${name} does not exist on the server`,
            2,
        )
    }
}

export default {
    getRole,
}
