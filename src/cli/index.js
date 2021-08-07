/*
 *  Parses command line arguments and options and returns the parsed
 *  object before starting the bot.
 *  Created On 07 August 2021
 */

import { Command } from 'commander'
import dirname from 'es-dirname'
import fs from 'fs/promises'
import path from 'path'

import addArgs from './args.js'
export let args

export default async () => {
    // get details from package.json
    const { name, description, version } = JSON.parse(
        await fs.readFile(
            path.join(dirname(), '..', '..', 'package.json'),
            'utf-8',
        ),
    )

    const program = new Command()
        .name(name)
        .description(description)
        .version(
            `${name} v${version}`,
            '-v, --version',
            'show the ⌚️ version number',
        )

    // add our arguments
    addArgs(program)

    await program.parseAsync()
    args = program.opts()
}
