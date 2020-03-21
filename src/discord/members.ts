// This file will deal with all the people with all the members

import Discord from 'discord.js'
import Conf from 'conf'

import { ConfigImpl } from '../config'
import roles from './roles'

async function getAllMembers(config: Conf<ConfigImpl>): Promise<Discord.GuildMember[]> {
    const role = await roles.getBaseRole(config)
    return Array.from(role.members.values())
}

async function getMemberById(userId: string, config: Conf<ConfigImpl>): Promise<Discord.GuildMember> {
    const members = await getAllMembers(config)
    return members.find(member => member.id == userId)
}

async function getOnlineMembers(config: Conf<ConfigImpl>): Promise<Discord.GuildMember[]> {
    const role = await roles.getBaseRole(config)
    return Array.from(role.members.filter(member => member.presence.status == 'online').values())
}

export default {
    getAllMembers,
    getMemberById,
    getOnlineMembers
}