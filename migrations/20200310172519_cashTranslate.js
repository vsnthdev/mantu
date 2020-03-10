
exports.up = function (knex) {
    return knex.schema.createTable('cashTranslate', (table) => {
        table.text('code')
        table.text('value')
    })
}

exports.down = function (knex) {
    return knex.schema.dropTable('cashTranslate')
}
