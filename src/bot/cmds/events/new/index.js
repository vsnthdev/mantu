/*
 *  Create a new event on the Discord server.
 *  Created On 18 April 2021
 */

import DateJoi from '@joi/date'
import emojiRegex from 'emoji-regex'
import BaseJoi from 'joi'
import { DateTime } from 'luxon'

import { database } from '../../../../database/index.js'
import responses from './01-responses.js'
import create from './02-create.js'
import rolemenu from './async/rolemenu.js'
import setTopic from './async/topic.js'

const Joi = BaseJoi.extend(DateJoi)

const zero = input => (input < 10 ? `0${input}` : input.toString())

const action = async (inter, { name, emoji, color, time, date }) => {
    // tell the user we're working
    await responses.processing({ inter, operation: 'send' })

    // merge time and date into a new const
    const startsAt = DateTime.fromFormat(
        `${zero(time.getHours())}:${zero(time.getMinutes())} ${zero(
            date.getDay(),
        )}-${zero(date.getMonth())}-${zero(date.getFullYear())}`,
        'HH:mm dd-LL-yyyy',
    )

    // creating resources on Discord and then setting them up
    const { role, group, text, stage } = await create({
        name,
        color,
        emoji,
    })

    // define the promises that should be run
    // in async
    await Promise.all([
        // set the timings as topic text
        // to the text channel of the event
        setTopic({ text, time: startsAt }),

        // creating the event entry on our
        // PostgreSQL database
        database.postgres.events.add({
            name: `${emoji}  ${name}`,
            role,
            group,
            text,
            stage,
        }),

        // setup and configure role menu
        rolemenu({ name, emoji, role }),
    ])

    return await responses.completed({ inter, emoji, role, stage, text })
}

export default {
    action,
    description: 'Setup a new event on this server.',
    perms: ['ADMINISTRATOR'],
    schema: Joi.object({
        name: Joi.string().required(),
        emoji: Joi.string()
            .regex(new RegExp(emojiRegex().toString().slice(1, -2)))
            .required(),
        color: Joi.string().regex(new RegExp('[0-9A-F]{6}', 'i')).required(),
        time: Joi.date().format('HH:mm').required(),
        date: Joi.date().format('DD-MM-YYYY').required(),
    }),
    options: [
        {
            type: 3,
            name: 'name',
            required: true,
            description: 'The name of the event to be created.',
        },
        {
            type: 3,
            name: 'emoji',
            required: true,
            description: 'Emoji for the event to be created.',
        },
        {
            type: 3,
            name: 'color',
            required: true,
            description: 'Color for the event to be created.',
        },
        {
            type: 3,
            name: 'time',
            required: true,
            description:
                'Time in format hh:mm (24hr) format when the event starts.',
        },
        {
            type: 3,
            name: 'date',
            required: true,
            description: 'Date in format dd-mm-yyyy when the event starts.',
        },
    ],
}
