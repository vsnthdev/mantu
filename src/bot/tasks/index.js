/*
 *  This are custom functions that run at their own specification or
 *  interval. The client is passed to them and they can listen for events.
 *  Created On 24 September 2020
 */

import utilities from '@vasanthdeveloper/utilities'
import fs from 'fs'
import path from 'path'

import { app as logger } from '../../logger/index.js'

export const tasks = async client => {
    logger.info('Initializing tasks')

    // loop through all directories in current directory
    const dir = await fs.promises.readdir(
        path.resolve(path.join('src', 'bot', 'tasks')),
    )
    await utilities.loops.default.forEach(dir, async dir => {
        const fPath = path.resolve(path.join('src', 'bot', 'tasks', dir))
        const isDirectory = (await fs.promises.stat(fPath)).isDirectory()
        if (isDirectory) {
            // import the directory and asynchronously run the handler function
            await (await import(path.join(fPath, 'index.js'))).default(client)
        }
    })
}
