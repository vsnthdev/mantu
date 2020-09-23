/*
 *  This file will connect and disconnect the postgres database while holding
 *  the connection in memory.
 *  Created On 22 September 2020
 */

import path from 'path'

import knex from 'knex'
import execa from 'execa'

import knexfile from '../../../knexfile.js'
import logger from '../../logger/index.js'

// migrate to latest schema of database
const migrateLatest = async () => {
    try {
        await execa(path.join(process.cwd(), 'node_modules', '.bin', 'knex'), [
            '--esm',
            'migrate:latest',
        ])
        logger.success('Finished syncing PostgreSQL database schema')
    } catch (e) {
        logger.error(e, 2)
    }
}

// connect to PostgreSQL database
const connect = async () => {
    logger.verbose('Attempting to connect to PostgreSQL database')
    const temp = knex(knexfile)

    // verify the connection by running a RAW query
    try {
        await temp.raw('SELECT 1')
        logger.success('Connected to PostgreSQL database')

        // run migrations
        await migrateLatest()
    } catch (err) {
        logger.error(
            `Failed to connect to PostgreSQL database due to 👇\n${err.message}`,
            2,
        )
    }
}

const disconnect = () => {
    // dispose the connection to both the
    // databases
}

export const postgres = { connect, disconnect }
