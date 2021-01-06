/*
 *  This file will connect and disconnect the redis database while holding
 *  the connection in memory.
 *  Created On 23 September 2020
 */

import redisLib from 'redis'
import { promisify } from 'util'

import { config } from '../../config/index.js'
import logger from '../../logger/app.js'

const exportable = {}

// connect to the Redis database
export const connect = async () => {
    logger.verbose('Attempting to connect to Redis database')
    const client = redisLib.createClient({
        host: config.get('database.redis.host'),
        port: config.get('database.redis.port'),
        db: config.get('database.redis.channel'),
        password: config.get('database.redis.password')
            ? config.get('database.redis.password')
            : undefined,
    })

    // handle the errors
    client.on('error', err => {
        logger.error(
            `Failed to connect to Redis database due to 👇\n${err.message}`,
            2,
        )
    })

    // make set and get global, while converting
    // them into modern promises
    exportable['get'] = promisify(client.get).bind(client)
    exportable['set'] = promisify(client.set).bind(client)
    exportable['del'] = promisify(client.del).bind(client)

    // try the connection by setting a var
    await exportable.set('_server', 'testing')
    await exportable.del('_server')
    logger.info('Connected to Redis database')
}

// disconnect from the Redis database
export const disconnect = async () => {
    //
}

export const redis = { connect, disconnect }
export default exportable
