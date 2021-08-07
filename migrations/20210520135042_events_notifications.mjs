/*
 *  Adds a column to the events database to store if
 *  that particular event's notification was sent.
 *  Created On 20 May 2021
 */

export const up = knex =>
    knex.schema.table('events', table => {
        // // the host of the event
        table.text('host')

        // an integer to count number of
        // notifications sent for a particular
        // event, as they happen chronologically
        // we'll increase this number
        table.integer('notified').defaultTo(0)

        // when the event will start
        // according to the timezone of the
        // event host in Unix epoch
        table.text('starts').notNullable().defaultTo('0')
    })

export const down = knex =>
    knex.schema.table('events', table => {
        table.dropColumn('host')
        table.dropColumn('notified')
        table.dropColumn('starts')
    })
