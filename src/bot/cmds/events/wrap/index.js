/*
 *  Create a new event on the Discord server.
 *  Created On 18 April 2021
 */

import { database } from '../../../../database/index.js'
import rolemenu from './01-rolemenu.js'
import purge from './02-purge.js'
import respond from './03-respond.js'

const action = async (inter, { id: role }) => {
    // get event's connected resources from our database
    const data = await database.postgres.events.get(role)

    // handle when we don't have that role
    if (!data) return await respond.invalid({ inter, role })

    // respond with a processing message
    await respond.processing({ inter, operation: 'send' })

    // delete the entry from role menu
    const msg = await rolemenu(data.name.split(' ')[0])

    // delete resources created on Discord
    const purged = await purge(data)

    // delete our event in the database
    await database.postgres.events.purge(role)

    return await respond.finalize({
        inter,
        data,
        purged,
        operation: 'update',
        msg,
    })
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
