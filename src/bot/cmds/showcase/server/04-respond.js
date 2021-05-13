/*
 *  Responds to the user's interaction and guides the user.
 *  Created On 07 May 2021
 */

import { MessageEmbed } from 'discord.js'

import { discord } from '../../../discord/index.js'

export const addInputNote = embed => {
    embed.setDescription(
        embed.description
            .split('\n')
            .map(line => (line.length > 1 ? `**${line}**` : line))
            .join('\n')
            .concat('\n\n')
            .concat(
                ':bulb: **Tip:** Type __cancel__ to abort and clean up.\n\n',
            )
            .concat(':point_down:'),
    )

    return embed
}

const make = async (inter, code) =>
    await discord.interactions.send.embed({
        inter,
        ephemeral: true,
        embed: addInputNote(
            new MessageEmbed()
                .setTitle(`Why should someone join this server? :thinking:`)
                .setDescription(
                    [
                        `Please enter a clear and concise :clipboard: description`,
                        `below, for invite code: \`${code}\``,
                    ].join('\n'),
                ),
        ),
    })

const timeout = async inter =>
    await discord.interactions.update.embed({
        inter,
        ephemeral: true,
        embed: new MessageEmbed()
            .setTitle(`:clock4: It's Too Late!`)
            .setDescription(
                `It's been more than 2 minutes and you didn't respond yet.`,
            ),
    })

const cancelled = async inter =>
    await discord.interactions.update.embed({
        inter,
        ephemeral: true,
        embed: new MessageEmbed()
            .setTitle(`:rotating_light: Rolled It Back!`)
            .setDescription(
                `The operation has been cancelled as per user's request.`,
            ),
    })

const invalid = async (inter, reason, operation = 'update') =>
    await discord.interactions[operation].embed({
        inter,
        ephemeral: true,
        embed: new MessageEmbed()
            .setTitle(`:warning: Operation Aborted`)
            .setDescription(reason),
    })

const finalize = async (inter, desc, code) =>
    await discord.interactions.update.embed({
        inter,
        ephemeral: true,
        embed: new MessageEmbed()
            .setTitle(`:sparkles: Shiny New Showcase!`)
            .setDescription(desc)
            .addField('Code', code),
    })

export default {
    make,
    timeout,
    cancelled,
    invalid,
    finalize,
}
