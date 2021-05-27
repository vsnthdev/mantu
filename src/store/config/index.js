/*
 *  This file will create a config file using YAML.
 *  Created On 19 September 2020
 */

import utilities from '@vasanthdeveloper/utilities'
import chalk from 'chalk'
import Conf from 'conf'
import dirname from 'es-dirname'
import yaml from 'js-yaml'
import path from 'path'

import logger from '~logger/app.js'

import defaults from './defaults.js'
import schema from './schema.js'

export let config

export default async () => {
    config = new Conf({
        projectSuffix: '',
        cwd: path.join(dirname(), '..', '..', '..', 'data'),
        configName: 'config',
        fileExtension: 'yml',
        clearInvalidConfig: true,
        deserialize: yaml.load,
        serialize: data =>
            yaml.dump(JSON.parse(JSON.stringify(data)), {
                indent: 4,
            }),
    })

    // set default values
    await defaults(config)

    // validate the config file
    const validate = await utilities.promise.handle(
        schema.validateAsync(config.store),
    )

    // handle validation errors
    if (validate.error) {
        config.delete(validate.error.details[0].path.join('.'))
        logger.warning(
            `Removed invalid config due to 👇\n${validate.error.message}`,
        )
    }

    logger.info('Finished reading run control')
    logger.verbose(
        `Run control read from 👇\n${chalk.gray.dim.underline(config.path)}`,
    )
}
