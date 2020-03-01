//   ___    __________   |  Vasanth Developer (Vasanth Srivatsa)
//   __ |  / /___  __ \  |  ------------------------------------------------
//   __ | / / __  / / /  |  https://github.com/vasanthdeveloper/mantu.git
//   __ |/ /  _  /_/ /   |
//   _____/   /_____/    |  Entryfile for mantu project
//                       |

import Discord from 'discord.js'
import moment from 'moment'

import loadConfig from './config'
import logger from './logger'
import parseArgs from './cli'
import helpMessage from './cmd/help'
import online from './online'

async function main(): Promise<void> {
    // Parse the arguments
    const args = await parseArgs()
    logger.verbose(`Arguments: ${JSON.stringify(args)}`)

    // Handle the help flag
    if (args.help) {
        console.log(helpMessage)
        process.exit(0)
    }

    // Notify that the application has been started
    logger.okay(`Application boot on ${moment().format('llll')}`)

    // Load the config file
    logger.verbose('Loading configuration file')
    const config = await loadConfig()

    // Check if there is an access token
    if (config.get('token') == '') {
        logger.error('No access token provided. Aborting...', 2)
    }

    // Create a Discord client
    const client = new Discord.Client()
    client.once('ready', () => online(config, client))

    // Attempt to login
    client.login(config.get('token'))
        .catch(err => logger.error(err, 2))
}

main()