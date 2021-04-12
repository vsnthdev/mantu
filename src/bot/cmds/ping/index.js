/*
 *  This command measures and then responds with ping time and API latency.
 *  Created On 28 September 2020
 */

import { MessageEmbed } from 'discord.js'

import { client, discord } from '../../discord/index.js'

const action = async inter => {
    const embed = new MessageEmbed().addField(
        'Ping',
        `${Math.round(client.ws.ping)}ms`,
        true,
    )

    await discord.interactions.sendEmbed(embed, inter)
}

export default {
    action,
    description: 'Measures and responds with ping time and API latency.',
}
