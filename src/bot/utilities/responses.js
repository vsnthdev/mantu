/*
 *  Common message and embed responses used across the bot.
 *  Created On 19 May 2021
 */

import { MessageEmbed } from 'discord.js'

import { discord } from '../discord/index.js'

// adds a helpful message telling the user
// that we're expecting some user input
// and also gives a way to cancel out
// the operation
export const addInputNote = embed => {
    if (embed.description) {
        embed.setDescription(
            embed.description
                .concat('\n\n')
                .concat(
                    ':bulb: **Tip:** Type __cancel__ to abort and clean up.\n',
                ),
        )
    } else {
        embed.setDescription(
            ':bulb: **Tip:** Type __cancel__ to abort and clean up.',
        )
    }

    return embed
}

// this object should be used as a template
// for responding to commands during an operation
// below are the default responses, used in most
// interactions, we'll be overriding them
// in the particular command depending
// on the requirements
export default {
    // when there's an error in the operation
    // and cannot be proceeded
    abort: async ({ inter, reason, operation = 'update' }) =>
        await discord.interactions[operation].embed({
            inter,
            ephemeral: true,
            embed: new MessageEmbed()
                .setTitle(`Operation Aborted`)
                .setDescription(reason),
        }),

    // when the user types cancel manually
    // to stop the operation (without an any errors)
    cancelled: async inter =>
        await discord.interactions.update.embed({
            inter,
            ephemeral: true,
            embed: new MessageEmbed()
                .setTitle(`Rolled It Back!`)
                .setDescription(
                    `The operation has been cancelled as per your request.`,
                ),
        }),

    // when the operation is being executed
    // it will also be an update operation
    processing: async ({ inter, operation = 'update' }) =>
        await discord.interactions[operation].embed({
            inter,
            ephemeral: true,
            embed: new MessageEmbed().setTitle('Processing'),
        }),

    // when the user input expected wasn't given
    // in the expected duration of time
    timeout: async ({ inter, duration }) =>
        await discord.interactions.update.embed({
            inter,
            ephemeral: true,
            embed: new MessageEmbed()
                .setTitle(`It's Too Late!`)
                .setDescription(
                    `It's been more than ${duration} without a response, so the operation was aborted.`,
                ),
        }),

    // when the given operation has been completed
    completed: async ({ inter }) =>
        await discord.interactions.update.embed({
            inter,
            ephemeral: true,
            embed: new MessageEmbed().setTitle('Operation Successful'),
        }),
}
