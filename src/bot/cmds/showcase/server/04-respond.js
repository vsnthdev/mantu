/*
 *  Responds to the user's interaction and guides the user.
 *  Created On 07 May 2021
 */

import { MessageEmbed } from 'discord.js'

import { discord } from '../../../discord/index.js'

const make = async (inter, code) =>
    await discord.interactions.send.embed(
        new MessageEmbed()
            .setTitle(`Why should someone join this server? :thinking:`)
            .setDescription(
                [
                    `**Please enter a clear and concise :clipboard: description**`,
                    `**below, for invite code:** \`${code}\`\n`,
                    `:bulb: **Tip:** Type __cancel__ to abort and clean up.\n`,
                    `:point_down:`,
                ].join('\n'),
            ),
        inter,
    )

const timeout = async inter =>
    await discord.interactions.update.embed(
        new MessageEmbed()
            .setTitle(`:clock4: It's Too Late!`)
            .setDescription(
                `It's been more than 2 minutes and you didn't respond yet.`,
            ),
        inter,
    )

const cancelled = async inter =>
    await discord.interactions.update.embed(
        new MessageEmbed()
            .setTitle(`:rotating_light: Rolled It Back!`)
            .setDescription(
                `The showcase has been cancelled as per user's request.`,
            ),
        inter,
    )

const invalid = async (inter, reason) =>
    await discord.interactions.update.embed(
        new MessageEmbed()
            .setTitle(`:ghost: Doesn't Look Right!`)
            .setDescription(reason),
        inter,
    )

const finalize = async (inter, desc, code) =>
    await discord.interactions.update.embed(
        new MessageEmbed()
            .setTitle(`:sparkles: Shiny New Showcase!`)
            .setDescription(desc)
            .addField('Code', code),
        inter,
    )

export default {
    make,
    timeout,
    cancelled,
    invalid,
    finalize,
}
