/*
 *  Handles interaction methods.
 *  Created On 12 April 2021
 */

import axios from 'axios'

import { client } from './index.js'
import { transformEmbed } from './messages.js'

export default {
    send: {
        // send a new text reply to the interaction
        message: async (content, inter) =>
            await client.api.interactions(inter.id, inter.token).callback.post({
                data: {
                    type: 4,
                    data: {
                        content,
                    },
                },
            }),

        // send a new embed reply to the interaction
        embed: async (embed, inter, content = '') =>
            await client.api.interactions(inter.id, inter.token).callback.post({
                data: {
                    type: 4,
                    data: {
                        content,
                        embeds: [(await transformEmbed(embed)).toJSON()],
                    },
                },
            }),
    },
    update: {
        // update an existing interaction's response
        // with a text
        message: async (content, inter) =>
            await axios({
                method: 'PATCH',
                url: `https://discord.com/api/v8/webhooks/${client.user.id}/${inter.token}/messages/@original`,
                data: {
                    content,
                },
            }),

        // update an existing interaction's response
        // with a embed
        embed: async (embed, inter, content = '') =>
            await axios({
                method: 'PATCH',
                url: `https://discord.com/api/v8/webhooks/${client.user.id}/${inter.token}/messages/@original`,
                data: {
                    content,
                    embeds: [(await transformEmbed(embed)).toJSON()],
                },
            }),
    },
}
