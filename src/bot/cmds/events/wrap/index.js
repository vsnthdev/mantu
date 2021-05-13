/*
 *  Create a new event on the Discord server.
 *  Created On 18 April 2021
 */

import { database } from '../../../../database/index.js'
import purge from './01-purge.js'
import respond, { notFound } from './02-respond.js'

const action = async (inter, { id: role }) => {
    // get event's connected resources from our database
    const data = await database.postgres.events.get(role)

    // handle when we don't have that role
    if (!data) return await notFound(role, inter)

    // delete resources created on Discord
    const purged = await purge(data)

    // delete our event in the database
    await database.postgres.events.purge(role)

    return await respond(data.name, purged, inter)
}

export default {
    action,
    description: 'Clean up an event on this server.',
    perms: ['ADMINISTRATOR'],
    options: [
        {
            name: 'id',
            description: 'Text channel or stage channel id.',
            type: 8,
            required: true,
        },
    ],
}
