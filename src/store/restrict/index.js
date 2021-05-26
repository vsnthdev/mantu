/*
 *  Creates & manages a separate YAML store file
 *  used to store permissions for different commands.
 *  Created On 25 May 2021
 */

import chalk from 'chalk'
import Conf from 'conf'
import dirname from 'es-dirname'
import yaml from 'js-yaml'
import path from 'path'

import logger from '~logger/app.js'

import cleanup from './cleanup.js'
import defaults from './defaults.js'

export let restrict

export default async cmds => {
    restrict = new Conf({
        projectSuffix: '',
        cwd: path.join(dirname(), '..', '..', '..', 'data'),
        configName: 'restrict',
        fileExtension: 'yml',
        clearInvalidConfig: true,
        deserialize: yaml.load,
        serialize: data =>
            yaml.dump(JSON.parse(JSON.stringify(data)), {
                indent: 4,
            }),
    })

    await defaults(restrict)

    // auto remove entries for
    // no existing commands
    await cleanup(restrict, cmds)

    logger.verbose(
        `Restrict data read from 👇\n${chalk.gray.dim.underline(
            restrict.path,
        )}`,
    )
}
