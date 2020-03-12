//   ___    __________   |  Vasanth Developer (Vasanth Srivatsa)
//   __ |  / /___  __ \  |  ------------------------------------------------
//   __ | / / __  / / /  |  https://github.com/vasanthdeveloper/mantu.git
//   __ |/ /  _  /_/ /   |
//   _____/   /_____/    |  Entryfile for mantu project
//                       |

import moment from 'moment'

import loadConfig from './config'
import logger from './logger'
import parseArgs from './cli'
import helpMessage from './cmd/help'
import versionInfo from './cmd/version'
import online from './online'
import discord from './discord'
import database from './database'

async function main(): Promise<void> {
    // parse the arguments
    const args = await parseArgs()
    logger.verbose(`Arguments: ${JSON.stringify(args)}`)

    // handle the help flag
    if (args.help) {
        console.log(helpMessage)
        process.exit(0)
    }

    // handle the about flag
    if (args.version) {
        await versionInfo()
        process.exit(0)
    }

    // notify that the application has been started
    logger.okay(`Application boot on ${moment().format('llll')}`)

    // load the config file
    logger.verbose('Loading configuration file')
    const config = await loadConfig()

    // check if there is an access token
    if (config.get('token') == '') {
        logger.error('No access token provided. Aborting...', 2)
    }

    // check if we have a valid serverId
    if (typeof config.get('serverId') == 'number') {
        if (config.get('serverId').toString().length < 18) {
            logger.error('Invalid server ID provided. Aborting...', 3)
        }
    } else {
        logger.error('No server ID provided. Aborting...', 3)
    }

    // ensure we have a successful database connection
    await database.connect()

    // attempt to login
    discord.authenticate(config.get('token'), await online(config))
}

main()