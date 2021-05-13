/*
 *  Respond with an embed on both the interaction
 *  and at server logs channel.
 *  Created On 21 April 2021
 */

import { MessageEmbed } from 'discord.js'

import { config } from '../../../../config/index.js'
import { discord } from '../../../discord/index.js'

export const notFound = async (role, inter) => {
    // prepare the message
    const embed = new MessageEmbed()
        .setTitle('Event Not Found')
        .setDescription(`An event tied to <@&${role}> was not found.`)

    return await discord.interactions.send.embed({
        inter,
        embed,
        ephemeral: true,
    })
}

export default async (name, purged, inter) => {
    const role = purged.role ? ':white_check_mark: Deleted' : ':x: Failed'
    const text = purged.text ? ':white_check_mark: Deleted' : ':x: Failed'
    const stage = purged.stage ? ':white_check_mark: Deleted' : ':x: Failed'
    const group = purged.group ? ':white_check_mark: Deleted' : ':x: Failed'

    // prepare the message
    const embed = new MessageEmbed().setTitle(`${name} Wrapped`).addFields([
        {
            name: 'Role',
            value: role,
            inline: true,
        },
        {
            name: 'Text',
            value: text,
            inline: true,
        },
        {
            name: 'Stage',
            value: stage,
            inline: true,
        },
        {
            name: 'Group',
            value: group,
            inline: true,
        },
    ])

    // respond
    await discord.interactions.send.embed({ inter, embed, ephemeral: true })

    // send to log channel
    if (global.env == 'development') return
    const channel = await discord.channels.get(
        config.get('discord.channels.identifiers.logs'),
    )
    await discord.messages.send.embed(embed, { channel })
}
