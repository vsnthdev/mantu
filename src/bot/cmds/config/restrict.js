/*
 *  Key management for restriction rules.
 *  Created On 26 May 2021
 */

import { MessageEmbed } from 'discord.js'

import { discord, getFormattedCommands } from '~discord'
import { restrict } from '~restrict'

const set = async ({ inter, key, value }) => {
    const cmds = (await getFormattedCommands()).map(cmd => cmd.name)

    if (cmds.includes(key) == false)
        return await discord.interactions.send.embed({
            inter,
            ephemeral: true,
            embed: new MessageEmbed()
                .setTitle('Cannot set restriction')
                .setDescription(`A command named \`${key}\` does not exist.`),
        })

    const array = [value].concat(restrict.get(key) || [])
    restrict.set(key, array)

    return await discord.interactions.send.embed({
        inter,
        ephemeral: true,
        embed: new MessageEmbed().setTitle('Restriction applied'),
    })
}

const unset = async ({ inter, key, value }) => {
    if (!restrict.get(key))
        return await discord.interactions.send.embed({
            inter,
            ephemeral: true,
            embed: new MessageEmbed().setTitle(
                'Incorrect command to set restriction',
            ),
        })

    const existing = restrict.get(key)

    if (existing.includes(value) == false)
        return await discord.interactions.send.embed({
            inter,
            ephemeral: true,
            embed: new MessageEmbed().setTitle(`Restriction doesn't exist`),
        })

    restrict.set(
        key,
        existing.filter(elm => elm != value),
    )

    return await discord.interactions.send.embed({
        inter,
        ephemeral: true,
        embed: new MessageEmbed().setTitle('Restriction removed'),
    })
}

export default { set, unset }
