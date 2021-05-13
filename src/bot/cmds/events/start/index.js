/*
 *  Create a new event on the Discord server.
 *  Created On 18 April 2021
 */

import { MessageEmbed } from 'discord.js'

import { discord } from '../../../discord/index.js'

const action = async inter =>
    await discord.interactions.send.embed({
        inter,
        ephemeral: true,
        embed: new MessageEmbed().setTitle('start an event'),
    })

export default {
    action,
    description: 'Start a created event on this server.',
    perms: ['ADMINISTRATOR'],
    options: [],
}
