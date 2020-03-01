// This file executes everything that is done
// once the bot is online and ready

import Conf from 'conf'

import logger from './logger'
import discord from './discord'

// Tasks to be imported
import cleanUpServer from './tasks/cleanup'

// Interactions to be imported
import userActivityInfo from './interactions/userActivityInfo'
import { Message } from 'discord.js'

export default async function online(config: Conf<any>): Promise<Function> {
    return async () => {
        // Notify that the bot should be online now
        logger.success('The bot is online and ready')

        // Set the bot's status
        await discord.setStatus()

        // link the discord interactions
        await linkCommands()
    
        // Initial running of all the tasks
        await cleanUpServer(config)()
    }
}

async function linkCommands(): Promise<void> {
    // hookup the commandReceived event
    discord.events.commandReceived((command: string, message: Message) => {
        // act accordingly
        if (command.startsWith('info ')) {
            userActivityInfo(message)
        }
    })
}