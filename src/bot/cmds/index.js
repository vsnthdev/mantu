/*
 *  This file will listen for commands to the Discord bot and will respond accordingly.
 *  Created On 28 September 2020
 */

import chalk from 'chalk'
import dirname from 'es-dirname'
import glob from 'glob'
import path from 'path'

import { config } from '../../config/index.js'
import logger from '../../logger/app.js'
import { client } from '../discord/index.js'
import listen from './listen.js'

const update = async () => {
    const registered = await client.api
        .applications(client.user.id)
        .guilds(config.get('discord.server'))
        .commands()
        .get()

    for (const rCmd of registered) {
        const exists = client.cmds.find(cmd => cmd.name == rCmd.name)

        if (!exists) {
            await client.api
                .applications(client.user.id)
                .guilds(config.get('discord.server'))
                .commands(rCmd.id)
                .delete()

            logger.verbose(
                `Unregistered ${chalk.gray.dim(
                    rCmd.name,
                )} command from Discord`,
            )
        }
    }
}

export default async () => {
    // where we'll store all loaded commands
    // into memory
    client.cmds = []

    // grab all command files
    const files = glob
        .sync(path.join(dirname(), '**', 'index.js'))
        .filter(file => path.basename(path.dirname(file)) != 'cmds')

    // loop through each file and import them
    for (const file of files) {
        const { default: mod } = await import(file)
        const name = path.parse(path.dirname(file)).name

        client.cmds.push({ ...mod, ...{ name } })

        await client.api
            .applications(client.user.id)
            .guilds(config.get('discord.server'))
            .commands.post({
                data: {
                    name,
                    description: mod.description,
                },
            })
        logger.verbose(`Registered ${chalk.gray.dim(name)} with Discord`)
    }

    logger.info('Finished loading commands into memory')

    // delete non-existing commands in background
    update()

    // listen for any commands
    // now that we've loaded all of them into memory
    await listen()
}
