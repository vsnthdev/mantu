/*
 *  Create a new event on the Discord server.
 *  Created On 18 April 2021
 */

import { database } from '../../../../database/index.js'
import rolemenu from './01-rolemenu.js'
import purge from './02-purge.js'
import responses from './03-responses.js'

const action = async (inter, { id: role }) => {
    // get event's connected resources from our database
    const data = await database.postgres.events.get(role)

    // handle when we don't have that role
    if (!data && inter) return await responses.abort({ inter, role })

    // respond with a processing message
    inter && (await responses.processing({ inter, operation: 'send' }))

    // delete the entry from role menu
    await rolemenu(data.name.split(' ')[0])

    // delete resources created on Discord
    const purged = await purge(data)

    // delete our event in the database
    await database.postgres.events.purge(role)

    return await responses.completed({
        inter,
        data,
        purged,
        operation: 'update',
    })
}

export default {
    action,
    description: 'Clean up an event on this server.',
    perms: ['perm:ADMINISTRATOR'],
    options: [
        {
            name: 'id',
            description: 'Text channel or stage channel id.',
            type: 8,
            required: true,
        },
    ],
}
