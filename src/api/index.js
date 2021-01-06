/*
 *  This file will configure and start Hapi.js server.
 *  Created On 06 January 2021
 */

import Hapi from '@hapi/hapi'
import chalk from 'chalk'

import { config } from '../config/index.js'
import logger from '../logger/api.js'
import routes from './routes.js'

export default async () => {
    // create a Hapi.js server
    const server = Hapi.server({
        host: config.get('server.host'),
        port: config.get('server.port'),
    })

    // connect all routes
    await routes(server)

    // start listening
    await server.start()
    logger.success(
        `${chalk.whiteBright.underline(
            'mantu',
        )}'s API started on ${chalk.gray.underline(server.info.uri)}`,
    )
}
