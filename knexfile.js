/*
 *  The knex configuration file for SQL databases.
 *  Created On 19 September 2020
 */

import chalk from 'chalk'
import fs from 'fs'
import yaml from 'js-yaml'
import path from 'path'

// knex.js config options
export const client = 'pg'
export const debug = false
export const pool = { min: 1, max: 20 }
export let connection = null
export const migrations = { tableName: 'migrations' }

// try to open the config file
// and read the settings
// if failed, simply log an error
// and terminate
try {
    const {
        database: { postgres },
    } = yaml.load(
        fs.readFileSync(path.resolve(path.join('data', 'config.yml')), {
            encoding: 'utf-8',
        }),
    )

    // now, assign database to connection
    // global variable we declared 👆
    connection = postgres
} catch {
    console.log(
        `${chalk.whiteBright.underline(
            'mantu',
        )} hasn't been initialized yet.\nPlease run at least once before attempting to connect to the database.`,
    )
    process.exit(0)
}
