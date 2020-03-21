// This file deals with the emojis on the server

import Discord from 'discord.js'

import client from './discord'

async function getAllEmojis(): Promise<Discord.GuildEmoji[]> {
    const guild = client.guilds.cache.first()
    return Array.from(guild.emojis.cache.values())
}

export default {
    getAllEmojis
}