/*
 *  Handles interaction methods.
 *  Created On 12 April 2021
 */

import { client } from './index.js'
import { transformEmbed } from './messages.js'

const sendString = async (msg, inter) =>
    await client.api.interactions(inter.id, inter.token).callback.post({
        data: {
            type: 4,
            data: {
                content: msg,
            },
        },
    })

const sendEmbed = async (embed, inter) => {
    await client.api.interactions(inter.id, inter.token).callback.post({
        data: {
            type: 4,
            data: {
                embeds: [(await transformEmbed(embed)).toJSON()],
            },
        },
    })
}

export default {
    sendString,
    sendEmbed,
}
