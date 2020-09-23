/*
 *  Creates the members table with initial properties.
 *  Created On 19 September 2020
 */

export const up = knex =>
    knex.schema.createTable('members', table => {
        // this is the member id from Discord
        table.text('id')

        // a username with hash, for example 👇
        // Vasanth Srivatsa#1135
        table.text('identifier')
    })

export const down = knex => knex.schema.dropTable('members')
