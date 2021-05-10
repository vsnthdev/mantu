/*
 *  Responds with an embed while also send a copy of the
 *  message to the log channel.
 *  Created On 21 April 2021
 */

import { MessageEmbed } from 'discord.js'

import { config } from '../../../../config/index.js'
import { discord } from '../../../discord/index.js'

export default async ({ inter, role, stage, text }) => {
    // prepare the message
    const embed = new MessageEmbed()
        .setTitle(`New Event Created`)
        .addField('Role', `<@&${role.id}>`)
        .addField('Stage', `<#${stage.id}>`, true)
        .addField('Text', `<#${text.id}>`, true)

    // respond
    await discord.interactions.send.embed(embed, inter)

    // send to log channel
    const channel = await discord.channels.get(config.get('discord.logs'))
    await discord.messages.send.embed(embed, { channel })
}
