/*
 *  This are custom functions that run at their own specification or
 *  interval. The client is passed to them and they can listen for events.
 *  Created On 24 September 2020
 */

import dirname from 'es-dirname'
import fs from 'fs'
import path from 'path'

import logger from '../../logger/app.js'

const load = async (dir, client, parallel = false) => {
    // loop through all directories in current directory
    const files = await fs.promises.readdir(dir)

    for (const name of files) {
        const absolute = path.join(dir, name)

        const isDirectory = (await fs.promises.stat(absolute)).isDirectory()
        if (isDirectory) {
            if (parallel == false) {
                // import the task and run the handler
                // function one-by-one
                await (await import(path.join(absolute, 'index.js'))).default(
                    client,
                )
            } else {
                // import the task and run all the handlers at once!
                ;(await import(path.join(absolute, 'index.js'))).default(client)
            }
        }
    }
}

export default async client => {
    // construct paths for both directories
    const consecutive = path.join(dirname(), 'consecutive')
    const parallel = path.join(dirname(), 'parallel')

    // first load the sync ones
    await load(consecutive, client)

    // now we'll load the async ones
    load(parallel, client, true)

    logger.info('Initialized all tasks')
}
