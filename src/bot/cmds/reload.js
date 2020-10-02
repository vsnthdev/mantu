/*
 *  This file will reload a command into memory during development.
 *  It does not do anything while in production.
 *  Created On 01 October 2020
 */

import path from 'path'

import { client } from '../discord/index.js'
import { app as logger } from '../../logger/index.js'
import validation from './validation.js'

// addCmd() will determine if the command is valid and add it to
// our list
export const addCmd = async (p, suppress) => {
    // to mitigate cache busting, we have to add a random query
    // string to the file path before we can import it
    const validated = validation(
        // eslint-disable-next-line prettier/prettier
        (
            // eslint-disable-next-line node/no-unsupported-features/es-syntax
            await import(
                `${path.resolve(p)}?id=${Math.random()
                    .toString(36)
                    .substring(3)}`
            )
        ).default,
        p,
    )
    if (typeof validated !== 'string') {
        client.cmds.push(validated)

        if (!suppress)
            logger.verbose(
                `Loaded command ${
                    p.split('src/bot/cmds')[1].substring(1).split('/')[0]
                }`,
            )
    } else {
        // notify the user that a command wasn't loaded
        logger.warning(
            `The command "${
                p.split('src/bot/cmds')[1].substring(1).split('/')[0]
            }" was not loaded due to 👇\n${validated}`,
        )
    }
}

const deleteCmd = async (p, suppress) => {
    // find and delete existing command
    const existing = client.cmds.find(
        cmd =>
            cmd.name == p.split('src/bot/cmds')[1].substring(1).split('/')[0],
    )
    if (existing) client.cmds.splice(client.cmds.indexOf(existing), 1)

    if (!suppress)
        logger.verbose(
            `Deleted ${
                p.split('src/bot/cmds')[1].substring(1).split('/')[0]
            } from memory`,
        )
}

const updateCmd = async p => {
    await deleteCmd(p, true)
    await addCmd(p, true)
    logger.verbose(
        `Reloaded ${
            p.split('src/bot/cmds')[1].substring(1).split('/')[0]
        } command into memory`,
    )
}

export default async () => {
    const env = process.env.NODE_ENV ? process.env.NODE_ENV : 'development'

    if (env == 'development') {
        // add auto reload for commands so
        // the bot doesn't need to restart every
        // time a command is updated
        // eslint-disable-next-line node/no-unsupported-features/es-syntax
        const chokidar = (await import('chokidar')).default

        chokidar
            .watch(path.join('src', 'bot', 'cmds'), { ignoreInitial: true })
            .on('all', (e, p) => {
                if (!['addDir', 'change', 'unlinkDir', 'unlink'].includes(e))
                    return
                if (p == 'src/bot/cmds' || p == 'src/bot/cmds/index.js') return

                if (e == 'addDir') {
                    addCmd(p)
                } else if (e == 'change' || e == 'unlink') {
                    updateCmd(p)
                } else if (e == 'unlinkDir') {
                    deleteCmd(p)
                }
            })
    }
}
