/*
 *  This file interfaces with members on a Discord server.
 *  Created On 05 January 2021
 */

import { config } from '../../config/index.js'
import { client } from './index.js'

const hasRole = async (member, role) => {
    const roles = Array.from(member.roles.cache.values())

    if (typeof role == 'string') {
        return roles.map(role => role.name).includes(role)
    } else {
        return roles.includes(role)
    }
}

const isInServer = async member => {
    const guild = client.guilds.cache.get(config.get('discord.server'))
    const exists = guild.member(member.id)

    if (exists) {
        return true
    } else {
        return false
    }
}

export default {
    hasRole,
    isInServer,
}
