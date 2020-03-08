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
    // Set the status
    client.user.setPresence({
        game: {
            name: 'this server.',
            type: 'WATCHING',
            url: 'https://vasanth.tech'
        },
        status: 'online'
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
    }
}