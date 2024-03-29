/*
 *  Common message and embed responses used across the bot.
 *  Created On 19 May 2021
 */

import { MessageEmbed } from 'discord.js'

import { discord } from '~discord'

export const embedColors = {
    // when an error occurs
    // during an operation
    red: '#EF233C',

    // when an operation is on-going
    blue: '#09A6F3',

    // when an operation is
    // successfully executed
    green: '#34D399',

    // when the user provides invalid
    // inputs, or the operation is aborted
    // before anything modifications are made
    yellow: '#FFD60A',

    // when requesting user input
    purple: '#5865F2',
}

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
                .setDescription(reason)
                .setColor(embedColors.red),
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
                )
                .setColor(embedColors.yellow),
        }),

    // when the operation is being executed
    // it will also be an update operation
    processing: async ({ inter, operation = 'update' }) =>
        await discord.interactions[operation].embed({
            inter,
            ephemeral: true,
            embed: new MessageEmbed()
                .setTitle('Processing')
                .setColor(embedColors.blue),
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
                )
                .setColor(embedColors.yellow),
        }),

    // when the given operation has been completed
    completed: async ({ inter }) =>
        await discord.interactions.update.embed({
            inter,
            ephemeral: true,
            embed: new MessageEmbed()
                .setTitle('Operation Successful')
                .setColor(embedColors.green),
        }),
}
