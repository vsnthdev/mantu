// This file executes everything that is done
// once the bot is online and ready

import Conf from 'conf'
import Discord from 'discord.js'

import logger from './logger'
import events from './discord/events'
import logging from './discord/logging'
import { setStatus } from './discord/discord'
import initDatabase from './database/init'
import { ConfigImpl } from './config'
import { errorHandler } from './utilities/error'
import interactions from './interactions/index'

// Tasks to be imported
import cleanUpServer from './tasks/cleanup'

async function linkCommands(config: Conf<any>): Promise<void> {
    // hookup the commandReceived event
    events.commandReceived(config, async (command: string, message: Discord.Message) => {
        let commandExecutionSuccessful = false

        // act accordingly
        if (command.startsWith('info')) {
            commandExecutionSuccessful = await interactions.moderation.info(command, message, config)
        } else if (command.startsWith('timezone ')) {
            commandExecutionSuccessful = await interactions.conversion.timezone(command, message)
        } else if (command.startsWith('time ') || command == 'time') {
            commandExecutionSuccessful = await interactions.conversion.time(command, message)
        } else if (command.startsWith('country ')) {
            commandExecutionSuccessful = await interactions.conversion.country(command, message)
        } else if (command.startsWith('cash ')) {
            commandExecutionSuccessful = await interactions.conversion.cash(command, message)
        } else if (command.startsWith('github ')) {
            commandExecutionSuccessful = await interactions.github.github(command, message, config)
        } else if (command.startsWith('clear ')) {
            await interactions.moderation.clear(command, message, config)
        } else if (command == 'server stats') {
            commandExecutionSuccessful = await interactions.moderation.serverStats(message, config)
        } else if (command == 'server invite') {
            commandExecutionSuccessful = await interactions.utilities.serverLink(message, config)
        } else if (command == 'help' || command == 'helpMessage') {
            commandExecutionSuccessful = await interactions.moderation.help(command, message, config)
        }

        // delete the message if the config has it
        if (config.get('deleteCommandAfterExecution') == true && commandExecutionSuccessful == true) {
            const deleteMessage = await errorHandler(message.delete())
            if (deleteMessage.e) {
                await logging.sendDiscordError(deleteMessage.e, message.member, message.channel as Discord.TextChannel, config)
            }
        }
    })
}

export default async function online(config: Conf<ConfigImpl>): Promise<Function> {
    return async (): Promise<void> => {
        // Notify that the bot should be online now
        logger.success('The bot is online and ready')

        // Set the bot's status
        await setStatus()

        // Synchronize our database with Discord
        await initDatabase(config)

        // link the discord interactions
        await linkCommands(config)
    
        // Initial running of all the tasks
        await cleanUpServer(config)
    }
}