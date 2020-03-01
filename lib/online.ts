// This file executes everything that is done
// once the bot is online and ready

import Conf from 'conf'

import logger from './logger'
import discord from './discord'

// Tasks to be imported
import cleanUpServer from './tasks/cleanup'

export default async function online(config: Conf<any>): Promise<Function> {
    return async () => {
        // Notify that the bot should be online now
        logger.success('The bot is online and ready')

        // Set the bot's status
        await discord.setStatus()
    
        // Initial running of all the tasks
        cleanUpServer(config)()
    }
}