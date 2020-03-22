// This file will respond with an invite link

import Discord from 'discord.js'
import Conf from 'conf'

import { ConfigImpl } from '../../config'
import { sendMessage, getRandomEmoji } from '../../discord/discord'

export default async function respond(message: Discord.Message, config: Conf<ConfigImpl>): Promise<boolean> {
    const inviteLink = config.get('inviteLink')

    // check if there is an invite link
    if (inviteLink !== '') {
        sendMessage(`${getRandomEmoji(true)} Here you go <${inviteLink}>.`, message.channel)
        return true
    } else {
        sendMessage(`${getRandomEmoji(false)} No invite link was configured.`, message.channel)
        return false
    }
}