// This file executes everything that is done
// once the bot is online and ready

import Conf from 'conf'

import logger from './logger'
import discord from './discord'

// Tasks to be imported
import cleanUpServer from './tasks/cleanup'

// Interactions to be imported
import userActivityInfo from './interactions/userActivityInfo'
import Discord from 'discord.js'

export default async function online(config: Conf<any>): Promise<Function> {
    return async () => {
        // Notify that the bot should be online now
        logger.success('The bot is online and ready')

        // Set the bot's status
        await discord.setStatus()

        // link the discord interactions
        await linkCommands(config)
    
        // Initial running of all the tasks
        await cleanUpServer(config)()
    }
}

async function linkCommands(config: Conf<any>): Promise<void> {
    // hookup the commandReceived event
    discord.events.commandReceived(config, async (command: string, message: Discord.Message) => {
        let commandExecutionSuccessful: boolean = false

        // act accordingly
        if (command.startsWith('info ')) {
            commandExecutionSuccessful = await userActivityInfo(message, config)
        }

        // delete the message if the config has it
        if (config.get('deleteCommandAfterExecution') == true && commandExecutionSuccessful == true) {
            message.delete()
        }
    })
}