/*
 *  Responds with an embed while also send a copy of the
 *  message to the log channel.
 *  Created On 21 April 2021
 */

import { MessageEmbed } from 'discord.js'

import { config } from '../../../../config/index.js'
import { discord } from '../../../discord/index.js'
import { addInputNote } from '../../showcase/server/04-respond.js'
import respond from '../../showcase/server/04-respond.js'

export default {
    invalid: respond.invalid,
    time: async ({ inter, name, emoji }) =>
        await discord.interactions.send.embed({
            inter,
            ephemeral: true,
            embed: addInputNote(
                new MessageEmbed()
                    .setTitle(
                        `:hourglass_flowing_sand: When does the event start?`,
                    )
                    .setDescription(
                        `Please enter the date & time when the event would start in the format\n\`HH:mm dd-LL-yyyy\` for the event \`${emoji} ${name}\`\n\n[Click here](https://moment.github.io/luxon/docs/manual/formatting.html#table-of-tokens) to see formatting help.`,
                    ),
            ),
        }),
    description: async ({ inter, name, emoji }) =>
        await discord.interactions.update.embed({
            inter,
            ephemeral: true,
            embed: addInputNote(
                new MessageEmbed()
                    .setTitle(`:thinking: What is the event about?`)
                    .setDescription(
                        `Please enter a detailed description for the event \`${emoji} ${name}\``,
                    ),
            ),
        }),
    processing: async ({ inter, operation = 'update' }) =>
        await discord.interactions[operation].embed({
            inter,
            embed: new MessageEmbed()
                .setTitle(':clock4: Processing')
                .setDescription(
                    'Please sit tight while, I am working on the server.',
                ),
        }),
    finalize: async ({ inter, emoji, role, stage, text }) => {
        // prepare the message
        const embed = new MessageEmbed()
            .setTitle(`:flame: Good Luck!`)
            .addField('Role', `<@&${role.id}>`)
            .addField('Stage', `<#${stage.id}>`, true)
            .addField('Text', `<#${text.id}>`, true)

        // send to log channel
        if (global.env != 'development') {
            const channel = await discord.channels.get(
                config.get('discord.channels.identifiers.logs'),
            )
            await discord.messages.send.embed(embed, { channel })
        }

        // add the Zira bot adding command
        embed.setDescription([
            `Run the below command to finish integration with <@275813801792634880>`,
            `\`\`\``,
            `z/toggle ${emoji} <@&${role.id}>`,
            `\`\`\``,
        ])

        // update the interaction
        await discord.interactions.update.embed({
            inter,
            embed,
            ephemeral: true,
        })
    },
}
