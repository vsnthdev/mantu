/*
 *  Sub-commands related to event management.
 *  Created On 18 April 2021
 */

import chalk from 'chalk'
import dirname from 'es-dirname'
import glob from 'glob'
import path from 'path'

import { client } from '~discord'
import logger from '~logger/app.js'

export const subCmds = async (dir, options) => {
    // grab all command files
    const files = glob
        .sync(path.join(dir, '*', 'index.js'))
        .filter(file => path.basename(path.dirname(file)) != 'cmds')

    // loop through each file and import them
    for (const file of files) {
        const { default: mod } = await import(file)
        const name = path.parse(path.dirname(file)).name
        const fullName = `${
            path.parse(path.dirname(path.dirname(file))).name
        } ${name}`

        client.cmds.push({ ...mod, ...{ name: fullName } })

        options.push({
            name,
            description: mod.description,
            options: mod.options,
            type: 1,
        })

        logger.verbose(`Registered ${chalk.gray.dim(fullName)} with Discord`)
    }

    return options
}

export default {
    description: 'Event management on this server.',
    options: await subCmds(dirname(), []),
}
