/*
 *  Validates & formats the description.
 *  Created On 07 May 2021
 */

import chunk from 'chunk-text'

import respond from './04-respond.js'

export default async (inter, raw) => {
    // remove any newlines
    let msg = raw.content.replace(/(\r\n|\n|\r)/gm, ' ')

    // ensure the description isn't too big
    if (msg.length >= 180) {
        await respond.invalid(
            inter,
            `The description is ${180 - msg.length} characters more than 140.`,
        )
        return
    }

    // format description
    msg = chunk(msg, 64)

    await raw.delete()
    return `**${msg.join('\n')}**`
}
