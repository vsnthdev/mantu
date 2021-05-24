/*
 *  Grabs user input from a given channel.
 *  Created On 07 May 2021
 */

import utilities from '@vasanthdeveloper/utilities'

import { discord } from '~discord'

import respond from './04-responses.js'

export default async inter => {
    // grab only author's messages
    const filter = msg => msg.author.id == inter.member.user.id

    const channel = await discord.channels.get(inter.channel_id)

    const { error, returned: desc } = await utilities.promise.handle(
        channel.awaitMessages(filter, {
            max: 1,
            time: 120000,
            errors: ['time'],
        }),
    )

    // handle cleanup!
    if (error) {
        await respond.timeout(inter)
        return
    }

    const rawDesc = desc.first().content

    if (rawDesc.toLowerCase() == 'cancel') {
        await desc.first().delete()
        await respond.cancelled(inter)
        return
    }

    desc.first().delete()
    return desc.first().content
}
