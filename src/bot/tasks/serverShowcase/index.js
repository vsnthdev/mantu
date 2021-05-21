/*
 *  Checks the validity of every server showcase and acts accordingly
 *  once they are expired.
 *  Created On 09 May 2021
 */

import utilities from '@vasanthdeveloper/utilities'
import axios from 'axios'
import { MessageEmbed } from 'discord.js'

import { config } from '../../../config/index.js'
import { discord } from '../../discord/index.js'

const action = async () => {
    // get the server showcase channel
    const channel = await discord.channels.get(
        config.get('discord.channels.identifiers.showcase.server'),
    )

    // get all messages
    const messages = Array.from((await channel.messages.fetch()).values())

    // loop through them
    for (const msg of messages) {
        // get the the action depending on the char table
        const line = msg.content.split('\n').pop()
        const code = line.split('/').pop()

        // and check if their invite link is valid
        const { error } = await utilities.promise.handle(
            axios({
                method: 'GET',
                url: `https://discordapp.com/api/invite/${code}`,
            }),
        )

        if (error) {
            // delete the showcase
            await msg.delete()

            // notify in the log channel
            const log = await discord.channels.get(
                config.get('discord.channels.identifiers.logs'),
            )
            await discord.messages.send.embed({
                channel: log,
                content: `<@&${config.get(
                    'discord.roles.identifer.moderator',
                )}>`,
                embed: new MessageEmbed()
                    .setTitle('Server Showcase Cleaned')
                    .setDescription(
                        `Server showcase with the below code has\nbeen cleaned due to expiration.`,
                    )
                    .addField('Code', code),
            })
        }
    }
}

export default async () => {
    action()

    // schedule this task to run every
    // 4 hours during production
    // and every 20 seconds during development

    global.env == 'development'
        ? setInterval(action, 20000)
        : setInterval(action, 14400000)
}
