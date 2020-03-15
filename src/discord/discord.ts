// This file will manage the initial things on Discord
// and every file depends on this file to get the client

import Discord from 'discord.js'

import logger from '../logger'

const client = new Discord.Client()

export async function authenticate(token: string, callback): Promise<void> {
    client.on('ready', callback)
    client.login(token)
        .catch(err => logger.error(err, 2))
    return
}

export async function setStatus(): Promise<void> {
    // check if we are on development or production
    const environment: string = process.env.NODE_ENV ? process.env.NODE_ENV : 'development'
    logger.verbose(`Running in ${environment} environment`)

    // Set the status
    client.user.setPresence({
        activity: {
            name: (environment == 'production') ? 'this server.' : 'Vasanth Developer.',
            type: (environment == 'production') ? 'WATCHING' : 'LISTENING',
            url: (environment == 'production') ? 'https://vasanth.tech' : 'https://github.com/vasanthdeveloper/mantu'
        },
        status: (environment == 'production') ? 'online' : 'dnd'
    })
}

export default client