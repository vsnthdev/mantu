import Discord from 'discord.js'
import Conf from 'conf'

import logger from './logger'

// Create a Discord client
const client = new Discord.Client()

// GLOBAL DISCORD
async function authenticate(token: string, callback: Function): Promise<void> {
    client.on('ready', callback)
    client.login(token)
        .catch(err => logger.error(err, 2))
    return
}

async function setStatus(): Promise<void> {
    // check if we are on development or production
    const environment: string = process.env.NODE_ENV ? process.env.NODE_ENV : 'development'
    logger.verbose(`Running in ${environment} environment`)

    // Set the status
    client.user.setPresence({
        game: {
            name: (environment == 'production') ? 'this server.' : 'Vasanth Developer.',
            type: (environment == 'production') ? 'WATCHING' : 'LISTENING',
            url: (environment == 'production') ? 'https://vasanth.tech' : 'https://github.com/vasanthdeveloper/mantu'
        },
        status: (environment == 'production') ? 'online' : 'dnd'
    })
}

// MEMBERS
async function getAllMembers(config: Conf<any>): Promise<Discord.GuildMember[]> {
    const returnable = []

    const guild = client.guilds.first()
    const role = guild.roles.find(role => role.name === config.get('baseRole'))
    role.members.forEach(member => {
        returnable.push(member)
    })

    return returnable
}

// LOGGING
async function sendServerLog(content, config: Conf<any>): Promise<void> {
    const serverLog = await client.channels.find((channel) => channel.id == config.get('logChannel')) as Discord.TextChannel
    serverLog.send(content)
}

// EVENTS
function presenceChanged(callback): void {
    client.on('presenceUpdate', (oldMember, newMember) => {
        callback(oldMember, newMember)
    })
}

function guildUpdated(callback): void {
    client.on('guildMemberUpdate', (oldMember, newMember) => {
        callback(oldMember, newMember)
    })
}

function commandReceived(config: Conf<any>, callback): void {
    client.on('message', (message: Discord.Message) => {
        // check if the prefix is there to determine if the message
        // is intended for the bot
        if (message.content.startsWith(config.get('prefix'))) {
            callback(message.content.substring(1), message)
        }
    })
}

export default {
    authenticate,
    setStatus,
    members: {
        getAllMembers
    },
    events: {
        presenceChanged,
        guildUpdated,
        commandReceived
    },
    logging: {
        sendServerLog
    }
}