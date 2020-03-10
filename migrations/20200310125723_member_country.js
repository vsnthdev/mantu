
exports.up = function (knex) {
    return knex.schema.table('members', (table) => {
        table.text('country')
    })
}

exports.down = function (knex) {
    return knex.schema.table('members', (table) => {
        table.dropColumn('country')
    })
}
