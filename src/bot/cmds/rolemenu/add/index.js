/*
 *  Adds a new role to the role menu.
 *  Created On 13 May 2021
 */

import { MessageEmbed } from 'discord.js'

import { config } from '~config'
import { discord } from '~discord'

import { embedColors } from '../../../utilities/responses.js'

// gets the role message
export const getRoleMessage = async () => {
    const channel = await discord.channels.get(
        config.get('discord.channels.identifiers.roles'),
    )

    const msgs = await channel.messages.fetch()
    const msg =
        msgs.first() ||
        (await channel.send(
            ['> _ _', '> 🥼｜**Roles**', '> _ _ ', '> _ _', '_ _ '].join('\n'),
        ))

    return msg
}

const action = async (inter, { role, emoji }) => {
    const { name } = await discord.roles.get(role)

    const msg = await getRoleMessage()
    let { content } = msg

    content = content.split('\n')
    content.splice(content.length - 2, 0, `> ${emoji}  ➜  ${name}`)

    await msg.edit(content.join('\n'))

    return await discord.interactions.send.embed({
        inter,
        ephemeral: true,
        embed: new MessageEmbed()
            .setTitle('Successfully Added')
            .setDescription(
                `Added **"${emoji}  ➜  ${name}"** to the role menu message.`,
            )
            .setColor(embedColors.green),
    })
}

export default {
    action,
    description: 'Add a new role to the role menu message.',
    perms: ['perm:ADMINISTRATOR'],
    options: [
        {
            name: 'role',
            description: 'Role to be added to the menu.',
            type: 8,
            required: true,
        },
        {
            type: 3,
            name: 'emoji',
            required: true,
            description: 'Emoji to react to for getting the role.',
        },
    ],
}
