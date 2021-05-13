/*
 *  Handles interaction methods.
 *  Created On 12 April 2021
 */

import axios from 'axios'

import { client } from './index.js'
import { transformEmbed } from './messages.js'

const transform = (data, { ephemeral }) => {
    if (ephemeral == true) data['flags'] = 64

    return data
}

export default {
    send: {
        // send a new text reply to the interaction
        message: async ({ inter, content, ephemeral = false }) =>
            await client.api.interactions(inter.id, inter.token).callback.post({
                data: {
                    type: 4,
                    data: transform(
                        {
                            content,
                        },
                        { ephemeral },
                    ),
                },
            }),

        // send a new embed reply to the interaction
        embed: async ({ inter, embed, content = '', ephemeral = false }) =>
            await client.api.interactions(inter.id, inter.token).callback.post({
                data: {
                    type: 4,
                    data: transform(
                        {
                            content,
                            embeds: [(await transformEmbed(embed)).toJSON()],
                        },
                        { ephemeral },
                    ),
                },
            }),
    },
    update: {
        // update an existing interaction's response
        // with a text
        message: async ({ inter, content, ephemeral = false }) =>
            await axios({
                method: 'PATCH',
                url: `https://discord.com/api/v8/webhooks/${client.user.id}/${inter.token}/messages/@original`,
                data: transform(
                    {
                        content,
                    },
                    { ephemeral },
                ),
            }),

        // update an existing interaction's response
        // with a embed
        embed: async ({ inter, embed, content = '', ephemeral = false }) =>
            await axios({
                method: 'PATCH',
                url: `https://discord.com/api/v8/webhooks/${client.user.id}/${inter.token}/messages/@original`,
                data: transform(
                    {
                        content,
                        embeds: [(await transformEmbed(embed)).toJSON()],
                    },
                    { ephemeral },
                ),
            }),
    },
}
