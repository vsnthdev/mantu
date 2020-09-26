/*
 *  This file interfaces with roles on a Discord server.
 *  Created On 25 September 2020
 */

import { client } from './index.js'
import config from '../../config/index.js'
import { discord as logger } from '../../logger/index.js'

const getBaseRole = async () => {
    const guild = client.guilds.cache.first()
    const baseRole = guild.roles.cache.find(
        role => role.id === config.get('discord.baseRole'),
    )
    if (baseRole) {
        return baseRole
    } else {
        logger.error(
            `A role with ID ${config.get(
                'discord.baseRole',
            )} does not exist on the server.`,
            2,
        )
    }
}

export default {
    getBaseRole,
}
