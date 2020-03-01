// This file executes everything that is done
// once the bot is online and ready

import Discord from 'discord.js'
import Conf from 'conf'

import logger from './logger'

// Tasks to be imported
import cleanUpServer from './tasks/cleanup'

export default async function online(config: Conf<any>, client: Discord.Client): Promise<void> {
    // Notify that the bot should be online now
    logger.success('The bot is online and ready')

    // Set the status
    client.user.setPresence({
        game: {
            name: 'this server.',
            type: 'WATCHING',
            url: 'https://vasanth.tech'
        },
        status: 'online'
    })

    // Initial running of all the tasks
    logger.info('Running immediate tasks')
    cleanUpServer(config, client)()

    // Scheduled tasks
    logger.info('Scheduled tasks')
    setInterval(cleanUpServer(config, client), config.get('interval'))
}