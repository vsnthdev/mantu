/*
 *  Create a new event on the Discord server.
 *  Created On 18 April 2021
 */

import { database } from '../../../../database/index.js'
import create from './01-create.js'
import respond from './02-respond.js'

const action = async (inter, { name, color, emoji }) => {
    // create the required resource on Discord
    const { role, group, text, stage } = await create({ name, color, emoji })

    // add the newly created event into database
    await database.postgres.events.add({
        name: `${emoji}  ${name}`,
        role,
        group,
        text,
        stage,
    })

    // TODO: Send a welcome message to the text channel
    // showing a title and a description of the following event
    // also show the timings of the event in top timezones

    // TODO: upon the start command, we ping all users with that
    // role to invite them into the event

    return await respond({ inter, role, stage, text })
}

export default {
    action,
    description: 'Create a new event',
    options: [
        {
            type: 3,
            name: 'name',
            required: true,
            description: 'The name of the event to be created',
        },
        {
            type: 3,
            name: 'emoji',
            required: true,
            description: 'Emoji for the event to be created',
        },
        {
            type: 3,
            name: 'color',
            required: true,
            description: 'Color for the event to be created',
        },
    ],
}
