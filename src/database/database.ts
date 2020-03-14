// This file will initialize and connect to the database

import path from 'path'

import knex from 'knex'
import execa from 'execa'

import logger from '../logger'

const knexfile = require('../../knexfile')
const config = (process.env.NODE_ENV == 'production') ? knexfile['production'] : knexfile['development']

async function initializeTables(): Promise<any> {
    try {
        await execa(path.join(process.cwd(), 'node_modules', '.bin', 'knex'), ['migrate:latest'])
        logger.success('Finished syncing database structure')
    } catch(e) {
        logger.error(e, 2)
    }
}

export async function connectToDatabase(): Promise<void> {
    const tempDatabase = await knex(config)

    // check if we have a successful connection by testing a query
    try {
        await tempDatabase.raw('SELECT 1')

        // now that we are successfully connected to the database
        // run the migrations
        await initializeTables()

        // save the database connection in a global variable
        logger.success('Finished connecting to the database')
    } catch(e) {
        logger.error(`Failed to connect to the database due to: ${e.message}`, 4)
    }
}

export default knex(config)