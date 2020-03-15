// This file will deal with all the roles in the Discord server

import Discord from 'discord.js'
import Conf from 'conf'

import { ConfigImpl } from '../config'
import logger from '../logger'
import client from './discord'

async function getBaseRole(config: Conf<ConfigImpl>): Promise<Discord.Role> {
    const guild = client.guilds.cache.first()
    const baseRole = guild.roles.cache.find(role => role.id === config.get('roles').base)
    if (!baseRole) {
        logger.error(`A role with id ${config.get('roles').base} does not exist.`, 6)
    } else {
        return baseRole
    }
}

export default {
    getBaseRole
}