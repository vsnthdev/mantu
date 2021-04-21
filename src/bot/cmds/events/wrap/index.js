/*
 *  Create a new event on the Discord server.
 *  Created On 18 April 2021
 */

import { database } from '../../../../database/index.js'
import purge from './01-purge.js'
import respond from './02-respond.js'

const action = async (inter, { id: role }) => {
    const data = await database.postgres.events.get(role)

    // TODO: Handle when data is undefined
    if (!data) return

    // delete resources created on Discord
    await purge(data)

    // delete our event in the database
    await database.postgres.events.purge(role)

    return await respond({ inter, name: data.name })
}

export default {
    action,
    description: 'Delete an event',
    options: [
        {
            name: 'id',
            description: 'Text channel or stage channel ID',
            type: 8,
            required: true,
        },
    ],
}
