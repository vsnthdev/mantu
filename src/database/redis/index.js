/*
 *  This file will connect and disconnect the redis database while holding
 *  the connection in memory.
 *  Created On 23 September 2020
 */

import { promisify } from 'util'

import redisLib from 'redis'

import logger from '../../logger/index.js'
import config from '../../config/index.js'

let set
let get
let del

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
    get = promisify(client.get).bind(client)
    set = promisify(client.set).bind(client)
    del = promisify(client.del).bind(client)

    // try the connection by setting a var
    await set('_server', 'testing')
    await del('_server')
    logger.info('Connected to Redis database')
}

// disconnect from the Redis database
export const disconnect = async () => {
    //
}

export const redis = { connect, disconnect }
export default { get, set, del }
