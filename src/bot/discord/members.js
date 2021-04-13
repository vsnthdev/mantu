/*
 *  This file interfaces with members on a Discord server.
 *  Created On 05 January 2021
 */

import guilds from './guilds.js'

const hasRole = async (member, role) => {
    const roles = Array.from(member.roles.cache.values())

    if (typeof role == 'string') {
        return roles.map(role => role.name).includes(role)
    } else {
        return roles.includes(role)
    }
}

const isInServer = async member => {
    const everyone = await getAllMembers(false, true)
    return Boolean(everyone.find(mem => mem.id == member))
}

const getAllMembers = async (bots = false, admin = false) => {
    const guild = await guilds.getGuild()
    let members = Array.from(await guild.members.fetch()).map(mem => mem[1])

    if (bots == false) members = members.filter(mem => mem.user.bot == false)
    if (admin == false)
        members = members.filter(
            mem => mem.hasPermission('ADMINISTRATOR') == false,
        )

    return members
}

export default {
    hasRole,
    isInServer,
    getAllMembers,
}
