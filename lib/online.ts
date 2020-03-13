// This file executes everything that is done
// once the bot is online and ready

import Conf from 'conf'
import Discord from 'discord.js'

import logger from './logger'
import discord from './discord'

// Tasks to be imported
import cleanUpServer from './tasks/cleanup'

// Interactions to be imported
import userActivityInfo from './interactions/userActivityInfo'
import setTimezone from './interactions/setTimezone'
import timeTranslate from './interactions/timezoneTranslate'
import setCountry from './interactions/setCountry'
import cashTranslate from './interactions/cashTranslate'
import github from './interactions/github'

export function errorHandler(promiseToHandle: Promise<any>): Promise<any> {
    return new Promise(resolve => {
        promiseToHandle
            .catch(e => {
                resolve({
                    e
                })
            })
            .then(data => {
                resolve({
                    data
                })
            })
    })
}

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
        } else if (command.startsWith('timezone ')) {
            commandExecutionSuccessful = await setTimezone(command, message)
        } else if (command.startsWith('time ') || command == 'time') {
            commandExecutionSuccessful = await timeTranslate(command, message)
        } else if (command.startsWith('country ')) {
            commandExecutionSuccessful = await setCountry(command, message)
        } else if (command.startsWith('cash ')) {
            commandExecutionSuccessful = await cashTranslate(command, message)
        } else if (command.startsWith('github ')) {
            commandExecutionSuccessful = await github(command, message)
        }

        // delete the message if the config has it
        if (config.get('deleteCommandAfterExecution') == true && commandExecutionSuccessful == true) {
            const deleteMessage = await errorHandler(message.delete())
            if (deleteMessage.e) {
                await discord.logging.sendDiscordError(deleteMessage.e, message.member, message.channel as Discord.TextChannel, config)
            }
        }
    })
}