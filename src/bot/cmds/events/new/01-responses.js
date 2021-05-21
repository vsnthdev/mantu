/*
 *  Responds with an embed while also send a copy of the
 *  message to the log channel.
 *  Created On 21 April 2021
 */

import { MessageEmbed } from 'discord.js'

import { config } from '../../../../config/index.js'
import { discord } from '../../../discord/index.js'
import responses, { embedColors } from '../../../utilities/responses.js'

export default {
    ...responses,
    ...{
        // the message we'll show the event
        // has been created
        completed: async ({ inter, emoji, role, stage, text }) => {
            // prepare the message
            const embed = new MessageEmbed()
                .setTitle(`Good Luck!`)
                .addField('Role', `<@&${role.id}>`)
                .addField('Stage', `<#${stage.id}>`, true)
                .addField('Text', `<#${text.id}>`, true)
                .setColor(embedColors.green)

            // send to log channel
            if (global.env != 'development') {
                const channel = await discord.channels.get(
                    config.get('discord.channels.identifiers.logs'),
                )
                await discord.messages.send.embed({ channel, embed })
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
    },
}
