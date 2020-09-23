/*
 *  This file is responsible for connecting both the postgres and redis databases
 *  and holding the connection object in memory.
 *  Created On 22 September 2020
 */

import { postgres } from './postgres/index.js'
import { redis } from './redis/index.js'

const connect = async () => {
    // connect both the databases
    await postgres.connect()
    await redis.connect()
}

const disconnect = () => {
    // dispose the connection to both the
    // databases
}

export default { connect, disconnect }
