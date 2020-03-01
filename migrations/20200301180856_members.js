/* eslint-disable no-unused-vars */

exports.up = function (knex) {
    return knex.schema.createTable('members', (table) => {
        table.text('id')
        table.text('name')
        table.text('lastActive')
    })
}

exports.down = function (knex) {
    return knex.schema.dropTable('members')
}