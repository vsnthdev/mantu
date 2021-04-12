/*
 *  Responds with the permanent invite link of the server.
 *  Created On 06 January 2021
 */

import { MessageEmbed } from 'discord.js'

import { config } from '../../../config/index.js'
import { discord } from '../../discord/index.js'

const action = async inter =>
    await discord.interactions.sendEmbed(
        new MessageEmbed()
            .setTitle(config.get('discord.invite.target'))
            .setURL(config.get('discord.invite.target')),
        inter,
    )

export default {
    action,
    description: 'Responds with a permanent invite link of the server.',
}
