// This file will manage the initial things on Discord
// and every file depends on this file to get the client

import Discord, { TextChannel } from 'discord.js'

import logger from '../logger'
import { setInterval } from '../utilities/time'
import diEmojis from './emojis'
import { forEach } from '../utilities/loops'

const client = new Discord.Client()

export async function authenticate(token: string, callback): Promise<void> {
    client.on('ready', callback)
    client.on('debug', (info: string) => {
        if (!info.includes('Manager was destroyed.'))
            logger.verbose(info)
    })
    client.login(token)
        .catch(err => logger.error(err, 2))
    return
}

export async function setStatus(): Promise<void> {
    // check if we are on development or production
    const environment: string = process.env.NODE_ENV ? process.env.NODE_ENV : 'development'
    logger.verbose(`Running in ${environment} environment`)

    // the list of presences
    // 0 = PLAYING
    // 1 = STREAMING
    // 2 = LISTENING
    // 3 = WATCHING
    const presences = [
        [3, 'this server.'],
        [3, 'for a command.'],
        [0, 'with cupcakes.']
    ]

    // change the presence for every 30 seconds
    setInterval(30000, async () => {
        const presence = presences[Math.floor(Math.random() * presences.length)]

        client.user.setPresence({
            status: (environment == 'production') ? 'online' : 'dnd',
            activity: {
                name: presence[1] as string,
                type: presence[0] as number,
                url: (environment == 'production') ? 'https://vasanth.tech' : 'https://github.com/vasanthdeveloper/mantu'
            },
        })
    })

    // Set the status
    client.user.setPresence({
        activity: {
            name: 'this server.',
            type: 'WATCHING',
            url: (environment == 'production') ? 'https://vasanth.tech' : 'https://github.com/vasanthdeveloper/mantu'
        },
        status: (environment == 'production') ? 'online' : 'dnd'
    })
}

export function logout(): void {
    logger.info('Logged out from Discord')
    client.destroy()
}

export function getRandomEmoji(isGood: boolean): string {
    const good = [
        ':dolphin:',
        ':koala:',
        ':gem:',
        ':mouse:',
        ':penguin:',
        ':whale:',
        ':ocean:',
        ':hatched_chick:',
        ':butterfly:',
        ':couch:'
    ]

    const bad = [
        ':dragon_face:',
        ':poop:',
        ':alien:',
        ':snake:',
        ':bug:',
        ':lobster:',
        ':skull_crossbones:',
        ':octopus:',
        ':cactus:',
        ':drop_of_blood:'
    ]

    if (isGood == true) {
        return good[Math.floor(Math.random() * good.length)]
    } else {
        return bad[Math.floor(Math.random() * bad.length)]
    }
}

export async function sendMessage(content: string | Discord.MessageEmbed, channel: Discord.Channel): Promise<Discord.Message> {
    const textChannel = channel as TextChannel
    if (typeof content == 'string') {
        const emojiRendered = await diEmojis.renderString(content)
        return await textChannel.send(`**${emojiRendered}**`)
    } else {
        if (content.description) content.setDescription(await diEmojis.renderString(content.description))
        if (content.title) content.setTitle(await diEmojis.renderString(content.title))
        
        await forEach(content.fields, async (field: Discord.EmbedField) => {
            content.fields.find(field2 => field2.name == field.name).value = await diEmojis.renderString(field.value)
        })

        return await textChannel.send('',  {
            embed: content
        })
    }
}

export default client