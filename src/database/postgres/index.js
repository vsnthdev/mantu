/*
 *  This file will connect and disconnect the postgres database while holding
 *  the connection in memory.
 *  Created On 22 September 2020
 */

import { promise } from '@vasanthdeveloper/utilities'
import { highlight } from 'cli-highlight'
import yaml from 'js-yaml'
import knex from 'knex'

import { config } from '~config'
import logger from '~logger/app.js'

import events from './events.js'
import members from './members.js'

export let database

const connect = async () => {
    // connect to the database using the provided config
    logger.verbose('Attempting to connect to PostgreSQL database')

    // prepare a masked password
    const maskedPassword = `${(
        config.get('database.postgres.pass') || ''
    ).slice(0, 5)}${'*'.repeat(
        (config.get('database.postgres.pass') || '').length,
    )}`

    // create and log the knexConfig object
    const knexConfig = {
        client: 'pg',
        debug: false,
        connection: {
            host: config.get('database.postgres.host'),
            port: config.get('database.postgres.port'),
            user: config.get('database.postgres.user'),
            database: config.get('database.postgres.name'),
            password: maskedPassword,
        },
        pool: {
            min: 1,
            max: 20,
        },
    }

    logger.verbose(
        `Here are the connection settings 👇\n${highlight(
            yaml.dump(knexConfig, {
                indent: 4,
            }),
            {
                language: 'yaml',
            },
        ).trim()}`,
    )

    // set the actual password before connecting
    knexConfig.connection.password = config.get('database.postgres.pass')

    // initialize knex with the config
    database = knex(knexConfig)

    // verify the connection by running a RAW query
    const { error } = await promise.handle(database.raw('SELECT 1'))
    if (error)
        logger.error(
            `Failed to connect to PostgreSQL database due to 👇\n${error.message}`,
            2,
        )

    // tell the user we have connected to the database
    logger.info('Connected to PostgreSQL database')

    // migrate the database schema to the latest version
    await database.migrate.latest()
    logger.info('Finished migrating PostgreSQL database schema')
}

// dispose the database connection
const disconnect = async () => await database.destroy()

export const postgres = { connect, disconnect }
export default {
    members,
    events,
}
