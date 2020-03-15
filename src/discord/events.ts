// This file will handle storage and calling the Discord events

import Discord from 'discord.js'
import Conf from 'conf'

import { ConfigImpl } from '../config'
import client from './discord'

function presenceChanged(callback): void {
    client.on('presenceUpdate', (oldMember, newMember) => {
        callback(oldMember, newMember)
    })
}

function guildMemberUpdate(callback): void {
    client.on('guildMemberUpdate', (oldMember, newMember) => {
        callback(oldMember, newMember)
    })
}

function commandReceived(config: Conf<ConfigImpl>, callback): void {
    client.on('message', (message: Discord.Message) => {
        // check if the prefix is there to determine if the message
        // is intended for the bot
        if (message.content.startsWith(config.get('prefix'))) {
            callback(message.content.substring(1), message)
        }
    })
}

export default {
    presenceChanged,
    guildMemberUpdate,
    commandReceived
}