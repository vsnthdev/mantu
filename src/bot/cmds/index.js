/*
 *  This file will listen for commands to the Discord bot and will respond accordingly.
 *  Created On 28 September 2020
 */

import dirname from 'es-dirname'
import glob from 'glob'
import path from 'path'

import { config } from '~config'
import { client } from '~discord'
import logger from '~logger/app.js'
import restrict from '~restrict'

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
        }
    }
}

export default async () => {
    // where we'll store all loaded commands
    // into memory
    client.cmds = []

    // grab all command files
    const files = glob
        .sync(path.join(dirname(), '*', 'index.js'))
        .filter(file => path.basename(path.dirname(file)) != 'cmds')

    // loop through each file and import them
    for (const file of files) {
        const { default: mod } = await import(file)
        const name = path.parse(path.dirname(file)).name

        client.cmds.push({ ...mod, ...{ name } })

        client.api
            .applications(client.user.id)
            .guilds(config.get('discord.server'))
            .commands.post({
                data: {
                    name,
                    description: mod.description,
                    options: mod.options,
                },
            })
    }

    await Promise.all([
        // delete non-existing commands in background
        update(),

        // create the restrict store file in background
        restrict(client.cmds),

        // listen for any commands
        // now that we've loaded all of them into memory
        listen(),
    ])

    logger.info(`Synced commands with Discord`)
}
