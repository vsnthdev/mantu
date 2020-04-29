//   ___    __________   |  Vasanth Developer (Vasanth Srivatsa)
//   __ |  / /___  __ \  |  ------------------------------------------------
//   __ | / / __  / / /  |  https://github.com/vasanthdeveloper/mantu.git
//   __ |/ /  _  /_/ /   |
//   _____/   /_____/    |  Entryfile for mantu project
//                       |

import moment from 'moment'
import clearLine from 'clear-terminal-line'

import loadConfig from './config'
import logger from './logger'
import parseArgs from './cli'
import helpMessage from './cmd/help'
import versionInfo from './cmd/version'
import online from './online'
import { connectToDatabase, destroy } from './database/database'
import { authenticate, logout } from './discord/discord'
import { sleep } from './utilities/time'

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

    // handle the delay
    if (typeof args.delay !== 'undefined') {
        if (isNaN(args.delay) == true || args.delay == null) {
            logger.error('Invalid delay value provided.', 7)
        } else {
            logger.info(`Waiting for ${args.delay} seconds before starting`)
            await sleep((args.delay * 1000))
        }
    }

    // clear the terminal screen
    console.clear()

    // notify that the application has been started
    const startedOn = moment()
    logger.okay(`Application boot on ${moment().format('llll')}`)

    // load the config file
    logger.verbose('Loading configuration file')
    const config = await loadConfig()

    // check if a valid access token was provided
    if (typeof config.get('token') != 'string' && config.get('token').length != 59) {
        logger.error(`The access token: ${config.get('token')} is invalid.`, 2)
    }

    // check if we have a valid serverId
    if (typeof config.get('serverId') != 'string' && config.get('serverId').length != 18) {
        logger.error(`The server ID ${config.get('serverId')} is invalid.`, 3)
    }

    // ensure we have a successful database connection
    await connectToDatabase()

    // attempt to login
    authenticate(config.get('token'), await online(config))

    // handle the application exit
    process.on('SIGINT', () => {
        clearLine()
        process.stdout.write('\r')
        logout()
        destroy()
            .then(() => {
                logger.okay(`Application ran for ${moment().diff(startedOn, 'minutes')} minutes`)
                process.exit()
            })
    })
}

main()