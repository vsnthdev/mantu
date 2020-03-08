
exports.up = function (knex) {
    return knex.schema.table('members', (table) => {
        table.text('timezone')
    })
}

exports.down = function (knex) {
    return knex.schema.table('members', (table) => {
        table.dropColumn('timezone')
    })
}
