/*
 *  This file will get all directories and attempt
 *  to load all routes along with some dynamic transformations.
 *  Created On 06 January 2021
 */

import utilities from '@vasanthdeveloper/utilities'
import chalk from 'chalk'
import dirname from 'es-dirname'
import glob from 'glob'
import path from 'path'

import logger from '../logger/api.js'

// getFiles will get all files named index.js
const getRoutes = async () => {
    // copied from 👇
    // https://stackoverflow.com/questions/6680825/return-string-without-trailing-slash
    const stripTrailingSlash = str => {
        return str.endsWith('/') ? str.slice(0, -1) : str
    }

    const indexes = glob.sync(path.join(dirname(), '**/index.js'))

    // remove this current file
    indexes.splice(indexes.indexOf(path.join(dirname(), 'index.js')), 1)

    // loop through each index file and import it
    const returnable = []

    for (const file of indexes) {
        const route = file.slice(dirname().length).split('/')[1]
        const module = (await import(file)).default

        module.path = stripTrailingSlash('/' + path.join(route, module.path))
        returnable.push(module)
    }

    return returnable
}

export default async server => {
    const routes = await getRoutes()

    // loop through all returned routes
    // and add them to our server
    for (const route of routes) {
        logger.verbose(
            `Linking ${chalk.gray.dim.underline(route.path)} to the server`,
        )
        await server.route(route)
    }
}
