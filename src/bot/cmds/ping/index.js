/*
 *  This command measures and then responds with ping time and API latency.
 *  Created On 28 September 2020
 */

import { MessageEmbed } from 'discord.js'
import discord from '../../discord/index.js'

const action = async msg =>
    await discord.messages.sendEmbed(
        new MessageEmbed()
            .addField('Ping', `${Math.round(msg.client.ws.ping)}ms`, true)
            .addField(
                'Latency',
                `${Date.now() - msg.createdTimestamp}ms`,
                true,
            ),
        msg,
    )

export default {
    action,
    description: 'Measures and responds with ping time and API latency.',
}
