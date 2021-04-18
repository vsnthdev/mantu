/*
 *  Create a new event on the Discord server.
 *  Created On 18 April 2021
 */

import { MessageEmbed } from 'discord.js'

import { discord } from '../../../discord/index.js'

const action = async inter =>
    await discord.interactions.sendEmbed(
        new MessageEmbed().setTitle('created new event'),
        inter,
    )

export default {
    action,
    description: 'Create a new event',
    options: [],
}
