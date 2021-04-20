/*
 *  Creates the required, role, group, text and voice channels
 *  on Discord.
 *  Created On 21 April 2021
 */

import slug from 'slug'

import { config } from '../../../../config/index.js'
import { discord } from '../../../discord/index.js'

export default async ({ name, color, emoji }) => {
    // create a new role
    const role = await discord.roles.createNewRole(
        name,
        color,
        `New Event: ${name}`,
    )

    // create a channel group
    const group = await discord.channels.createGroup(
        name,
        config.get('discord.channelPosition'),
    )

    // create a text channel
    const text = await discord.channels.createChannel({
        type: 'text',
        parent: group,
        isPrivate: role,
        name: `💬${config.get('discord.channelSep')}${slug(name)}`,
    })

    // create a voice channel or stage channel
    const stage = await discord.channels.createChannel({
        name: `${emoji}${config.get('discord.channelSep')}${slug(name)}`,
        type: 'voice',
        parent: group,
        isPrivate: role,
    })

    return { role, group, text, stage }
}
