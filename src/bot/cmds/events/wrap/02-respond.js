/*
 *  Respond with an embed on both the interaction
 *  and at server logs channel.
 *  Created On 21 April 2021
 */

import { MessageEmbed } from 'discord.js'

import { config } from '../../../../config/index.js'
import { discord } from '../../../discord/index.js'

export default async ({ inter, name }) => {
    // prepare the message
    const msg = new MessageEmbed()
        .setTitle('Event Wrapped')
        .addField('Name', name)

    // send to log channel
    const channel = await discord.channels.get(config.get('discord.logs'))
    await discord.messages.sendEmbed(msg, { channel })

    // respond
    return await discord.interactions.sendEmbed(msg, inter)
}
