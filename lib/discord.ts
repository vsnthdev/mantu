import Discord from 'discord.js'
import Conf from 'conf'

import logger from './logger'
import { ConfigImpl } from './config'

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

async function getAnyoneById(id: string): Promise<Discord.GuildMember> {
    const guild = client.guilds.first()
    return guild.members.find(anyone => anyone.id == id)
}

// ROLES
async function getBaseRole(config: Conf<ConfigImpl>): Promise<Discord.Role> {
    const guild = client.guilds.first()
    const baseRole = guild.roles.find(role => role.id === config.get('roles').base)
    if (!baseRole) {
        logger.error(`A role with id ${config.get('roles').base} does not exist.`, 6)
    } else {
        return baseRole
    }
}

// MEMBERS
async function getAllMembers(config: Conf<ConfigImpl>): Promise<Discord.GuildMember[]> {
    const role = await getBaseRole(config)
    return Array.from(role.members.values())
}

async function getMemberById(userId: string, config: Conf<ConfigImpl>): Promise<Discord.GuildMember> {
    const members = await getAllMembers(config)
    return members.find(member => member.id == userId)
}

// LOGGING
async function sendServerLog(content, config: Conf<any>): Promise<void> {
    const serverLog = await client.channels.find((channel) => channel.id == config.get('logChannel')) as Discord.TextChannel
    serverLog.send(content)
}

async function sendDiscordError(e: Discord.DiscordAPIError, author: Discord.GuildMember, channel: Discord.TextChannel, config: Conf<any>): Promise<void> {
    const content = new Discord.RichEmbed()
        .setColor(config.get('embedColor'))
        .setTitle(`A ${e.name} occurred in mantu`)
        .addField('Name', e.name, true)
        .addField('Code', e.code, true)
        .addField('Action', e.method, true)
        .addField('Triggered By', `<@${author.id}>`, true)
        .addField('On Channel', `<#${channel.id}>`, true)
        .addField('Message', e.message)
    
    await sendServerLog(content, config)
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
    getAnyoneById,
    members: {
        getAllMembers,
        getMemberById
    },
    logging: {
        sendServerLog,
        sendDiscordError
    },
    roles: {
        getBaseRole
    },
    events: {
        presenceChanged,
        guildUpdated,
        commandReceived
    },
}