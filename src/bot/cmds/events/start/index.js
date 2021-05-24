/*
 *  Create a new event on the Discord server.
 *  Created On 18 April 2021
 */

import { MessageEmbed } from 'discord.js'

import { discord } from '~discord'

const action = async inter =>
    // TODO: upon the start command, we ping all users with that
    // role to invite them into the event
    await discord.interactions.send.embed({
        inter,
        ephemeral: true,
        embed: new MessageEmbed().setTitle('start an event'),
    })

export default {
    action,
    description: 'Start a created event on this server.',
    perms: ['perm:ADMINISTRATOR'],
    options: [],
}
