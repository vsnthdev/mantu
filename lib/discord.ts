import Discord from 'discord.js'
import Conf from 'conf'

import logger from './logger'

// Create a Discord client
const client = new Discord.Client()

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

async function getAllMembers(config: Conf<any>): Promise<Discord.GuildMember[]> {
    const returnable = []

    const guild = client.guilds.first()
    const role = guild.roles.find(role => role.name === config.get('baseRole'))
    role.members.forEach(member => {
        returnable.push(member)
    })

    return returnable
}

export default {
    authenticate,
    setStatus,
    getAllMembers
}