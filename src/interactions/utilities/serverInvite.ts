// This file will respond with an invite link

import Discord from 'discord.js'
import Conf from 'conf'

import { ConfigImpl } from '../../config'

export default async function respond(message: Discord.Message, config: Conf<ConfigImpl>): Promise<boolean> {
    const inviteLink = config.get('inviteLink')

    // check if there is an invite link
    if (inviteLink !== '') {
        message.channel.send(`:mouse: **Here you go <${inviteLink}>.**`)
        return true
    } else {
        message.channel.send(':crab: **No invite link was configured.**')
        return false
    }
}