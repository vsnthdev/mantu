/*
 *  Responds to the user's interaction and guides the user.
 *  Created On 07 May 2021
 */

import { MessageEmbed } from 'discord.js'

import { discord } from '../../../discord/index.js'
import responses, { addInputNote } from '../../../utilities/responses.js'

export default {
    ...responses,
    ...{
        // ask the user the server's description
        desc: async ({ inter }) =>
            await discord.interactions.send.embed({
                inter,
                ephemeral: true,
                embed: addInputNote(
                    new MessageEmbed()
                        .setTitle(`Why should someone join this server?`)
                        .setDescription(
                            'Enter a clear and concise description.',
                        ),
                ),
            }),

        // the message to show when a server showcase has been posted
        completed: async ({ inter, desc, code }) =>
            await discord.interactions.update.embed({
                inter,
                ephemeral: true,
                embed: new MessageEmbed()
                    .setTitle(`Added server to showcase`)
                    .setDescription(desc)
                    .addField('Code', code),
            }),
    },
}
