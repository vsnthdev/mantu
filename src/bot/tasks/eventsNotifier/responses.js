/*
 *  Remainder messages for event timings.
 *  Created On 21 May 2021
 */

import { MessageEmbed } from 'discord.js'

import { discord } from '../../discord/index.js'

export default {
    // the notification to be send a day before
    early: async (channel, event) =>
        await discord.messages.send.embed({
            channel,
            content: `<@${event.host}>`,
            embed: new MessageEmbed()
                .setTitle('A day more to go!')
                .setDescription(
                    `A friendly reminder for tomorrow's <@&${event.role}> event.`,
                ),
        }),

    // 8 hours before the event starts
    day: async (channel, event) =>
        await discord.messages.send.embed({
            channel,
            content: `<@${event.host}>`,
            embed: new MessageEmbed()
                .setTitle('The day has come!')
                .setDescription(
                    `I hope you're preparing to rock the stage :metal:\non the <@&${event.role}> event today.`,
                ),
        }),

    // an hour before the event starts
    hour: async (channel, event) =>
        await discord.messages.send.embed({
            channel,
            content: `<@${event.host}>`,
            embed: new MessageEmbed()
                .setTitle(`Fill the checklist`)
                .setDescription(
                    `<@&${event.role}> event should start in an hour.`,
                ),
        }),
}
