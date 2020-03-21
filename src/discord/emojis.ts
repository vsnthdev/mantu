// This file deals with the emojis on the server

import Discord from 'discord.js'

import client from './discord'

async function getAllEmojis(): Promise<Discord.GuildEmoji[]> {
    const guild = client.guilds.cache.first()
    return Array.from(guild.emojis.cache.values())
}

async function getEmojiByName(name: string): Promise<Discord.Emoji> {
    const emojis = await getAllEmojis()
    return emojis.find(emo => emo.name == name)
}

async function renderString(input: string): Promise<string> {
    const emojis = await getAllEmojis()

    return input.replace(/:\w+:/g, (emojiName) => {
        const emoji = emojis.find(emo => emo.name == emojiName.replace(/:/g, ''))
        if (emoji) {
            return `<${emojiName}${emoji.id}>`
        } else {
            return emojiName
        }
    })
}

export default {
    getAllEmojis,
    getEmojiByName,
    renderString
}