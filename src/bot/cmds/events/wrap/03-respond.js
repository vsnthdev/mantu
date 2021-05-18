/*
 *  Respond with an embed on both the interaction
 *  and at server logs channel.
 *  Created On 21 April 2021
 */

import { MessageEmbed } from 'discord.js'

import { config } from '../../../../config/index.js'
import { discord } from '../../../discord/index.js'
import respond from '../../events/new/02-respond.js'

export default {
    ...respond,
    ...{
        invalid: async ({ inter, role }) =>
            await discord.interactions.send.embed({
                inter,
                ephemeral: true,
                embed: new MessageEmbed()
                    .setTitle('Event Not Found')
                    .setDescription(
                        `An event tied to <@&${role}> was not found.`,
                    ),
            }),

        finalize: async ({ inter, data, purged, operation, msg }) => {
            const role = purged.role
                ? ':white_check_mark: Deleted'
                : ':x: Failed'
            const text = purged.text
                ? ':white_check_mark: Deleted'
                : ':x: Failed'
            const stage = purged.stage
                ? ':white_check_mark: Deleted'
                : ':x: Failed'
            const group = purged.group
                ? ':white_check_mark: Deleted'
                : ':x: Failed'

            // prepare the message
            const embed = new MessageEmbed()
                .setTitle(`${data.name} Wrapped`)
                .addFields([
                    {
                        name: 'Role',
                        value: role,
                        inline: true,
                    },
                    {
                        name: 'Text',
                        value: text,
                        inline: true,
                    },
                    {
                        name: 'Stage',
                        value: stage,
                        inline: true,
                    },
                    {
                        name: 'Group',
                        value: group,
                        inline: true,
                    },
                ])

            // send to log channel
            if (global.env != 'development') {
                const channel = await discord.channels.get(
                    config.get('discord.channels.identifiers.logs'),
                )
                discord.messages.send.embed(embed, { channel })
            }

            // respond
            await discord.interactions[operation].embed({
                inter,
                embed,
                ephemeral: true,
            })
        },
    },
}
