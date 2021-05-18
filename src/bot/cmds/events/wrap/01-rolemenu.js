/*
 *  Remove the role from the role menu.
 *  Created On 13 May 2021
 */

import { getRoleMessage } from '../../rolemenu/add/index.js'

export default async emoji => {
    // remove role from message
    const msg = await getRoleMessage()
    let { content } = msg

    content = content.split('\n')
    const roles = content.slice(3, -2)

    const found = roles.find(role => role.includes(emoji))
    if (!found) return

    content.splice(content.indexOf(found), 1)
    await msg.edit(content.join('\n'))

    // remove the reactions of this emoji
    const reactions = Array.from(msg.reactions.cache.values())
    for (const reaction of reactions) {
        if (emoji == reaction._emoji.name) {
            await reaction.remove()
        }
    }

    return msg
}
