/*
 *  Showcase another Discord server.
 *  Created On 07 May 2021
 */

import message from './01-message.js'
import input from './02-input.js'
import description from './03-description.js'
import respond from './04-respond.js'

const action = async (inter, { code }) => {
    // if discord invite link was provided
    // instead, convert it to code
    if (code.startsWith('https://discord.gg')) code = code.substring(19)

    // respond to the interaction
    await respond.make(inter, code)

    // ask for user input
    const raw = await input(inter)
    if (!raw) return

    // validate & format it
    const desc = await description(inter, raw)
    if (!desc) return

    // send the invite message
    await message(desc, { code })

    // update the embed too!
    await respond.finalize(inter, desc.substring(2, desc.length - 2), code)
}

export default {
    action,
    description: 'Showcase another Discord server',
    perms: ['ADMINISTRATOR'],
    options: [
        {
            type: 3,
            name: 'code',
            required: true,
            description: 'Invite code for the server you want to showcase',
        },
    ],
}
