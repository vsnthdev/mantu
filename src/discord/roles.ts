// This file will deal with all the roles in the Discord server

import Discord from 'discord.js'
import Conf from 'conf'

import { ConfigImpl } from '../config'
import logger from '../logger'
import client from './discord'
import { forEach } from '../utilities/loops'

async function getBaseRole(config: Conf<ConfigImpl>): Promise<Discord.Role> {
    const guild = client.guilds.cache.first()
    const baseRole = guild.roles.cache.find(role => role.id === config.get('roles').base)
    if (!baseRole) {
        logger.error(`A role with id ${config.get('roles').base} does not exist.`, 6)
    } else {
        return baseRole
    }
}

async function getModeratorRoles(config: Conf<ConfigImpl>): Promise<Discord.Role[]> {
    const guild = client.guilds.cache.first()
    const returnable: Array<Discord.Role> = []

    if (config.get('roles').moderators.length < 1) {
        logger.error('No moderators specified in the configuration.')
        return []
    } else {
        // loop through all the moderator roles
        await forEach(config.get('roles').moderators, async (moderator) => {
            returnable.push(guild.roles.cache.find(role => role.id == moderator))
        })

        return returnable
    }
}

async function getAllRoles(): Promise<Discord.Role[]> {
    const guild = client.guilds.cache.first()
    return Array.from(guild.roles.cache.values())
}

export default {
    getBaseRole,
    getAllRoles,
    getModeratorRoles
}