/*
 *  The knex configuration file for SQL databases.
 *  Created On 19 September 2020
 */

import config from './src/config/index.js'

export default {
    client: 'postgresql',
    connection: {
        database: config.get('database.postgres.name'),
        user: config.get('database.postgres.username'),
        password: config.get('database.postgres.password'),
    },
    pool: {
        min: 2,
        max: 10,
    },
}
