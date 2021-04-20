/*
 *  Creates the events table with initial properties.
 *  Created On 21 April 2021
 */

export const up = knex =>
    knex.schema.createTable('events', table => {
        // the name of the emoji
        // (without the emoji)
        table.text('name')

        // role id of the event
        table.text('role')

        // the group id of the event
        table.text('group')

        // text channel id of the event
        table.text('text')

        // voice channel of the event
        table.text('stage')
    })

export const down = knex => knex.schema.dropTable('events')
