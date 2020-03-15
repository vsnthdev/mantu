// This file will handle anything that deals with a generic person on Discord

import Discord from 'discord.js'

import client from './discord'

async function getAnyoneById(id: string): Promise<Discord.GuildMember> {
    const guild = client.guilds.cache.first()
    return guild.members.cache.find(anyone => anyone.id == id)
}

export default {
    getAnyoneById
}