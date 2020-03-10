
exports.up = function (knex) {
    return knex.schema.createTable('countries', (table) => {
        table.text('name')
        table.text('nativeName')
        table.text('alpha2code')
        table.text('alpha3code')
        table.text('cashCode')
        table.text('cashSymbol')
    })
}

exports.down = function (knex) {
    return knex.schema.dropTable('countries')
}
