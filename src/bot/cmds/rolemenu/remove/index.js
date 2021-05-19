/*
 *  Removes a new role to the role menu.
 *  Created On 13 May 2021
 */

import { MessageEmbed } from 'discord.js'

import { discord } from '../../../discord/index.js'
import responses from '../../../utilities/responses.js'
import { getRoleMessage } from '../add/index.js'

const action = async (inter, { emoji }) => {
    const msg = await getRoleMessage()
    let { content } = msg

    content = content.split('\n')
    const roles = content.slice(3, -2)

    const found = roles.find(role => role.includes(emoji))

    // handle when emoji not found
    if (!found) {
        responses.abort({
            inter,
            operation: 'send',
            reason: `No role found in the role menu message with the given emoji "${emoji}".`,
        })
        return
    }

    content.splice(content.indexOf(found), 1)
    await msg.edit(content.join('\n'))

    return await discord.interactions.send.embed({
        inter,
        ephemeral: true,
        embed: new MessageEmbed()
            .setTitle(':zap: Job Done!')
            .setDescription(
                `Removed **"${found.substr(2)}"** from the role menu message.`,
            ),
    })
}

export default {
    action,
    description: 'Remove a role from the role menu message.',
    perms: ['ADMINISTRATOR'],
    options: [
        {
            type: 3,
            name: 'emoji',
            required: true,
            description: 'Emoji tied to the role to be removed.',
        },
    ],
}
