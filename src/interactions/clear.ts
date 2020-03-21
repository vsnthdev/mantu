// This file will clear the previous messages

import Discord from 'discord.js'
import Conf from 'conf'

import { errorHandler } from '../utilities/error'
import { ConfigImpl } from '../config'
import { onlyModerators } from './userActivityInfo'
import logging from '../discord/logging'

export default async function respond(command: string, message: Discord.Message, config: Conf<ConfigImpl>): Promise<void> {
    const parsed = parseInt(command.substring(6))

    // check if we got an actual number
    if (isNaN(parsed)) {
        message.channel.send(':beetle: **Invalid number provided with clear command.**')
    } else {
        // only allow mods to access this command
        const access = await onlyModerators(message, config)
        if (access == false) {
            message.channel.send(':beetle: **You don\'t have access to this command.** :person_shrugging:')
            return
        }

        // check if parsed is equal to or below 1000
        if (parsed >= 1000) {
            message.channel.send(':beetle: **Deleting more than 1000 messages isn\'t supported.**')
            return
        }

        // divide the number by 100, because we can only send 100 in bulkDelete
        const blocks = parsed / 100

        let deletedCount = 0
        let error: Discord.DiscordAPIError
        
        // if the block size is greater than 1
        if (blocks > 1) {
            for (let index = 1; index <= blocks; index++) {
                // do the bulk delete for so many times
                const deleted = await errorHandler(message.channel.bulkDelete(100))
                if (deleted.e) {
                    error = deleted.e
                } else {
                    deletedCount = deletedCount + Array.from(deleted.data).length
                }
            }

            // delete the remaining messages
            const remaining = (100 * blocks) - parsed
            // check if remaining isn't zero
            if (remaining >= 1) {
                const deleted = await errorHandler(message.channel.bulkDelete(remaining))
                if (deleted.e) {
                    error = deleted.e
                } else {
                    deletedCount = deletedCount + Array.from(deleted.data).length
                }
            }
        } else {
            const deleted = await errorHandler(message.channel.bulkDelete(parsed))
            if (deleted.e) {
                error = deleted.e
            } else {
                deletedCount = deletedCount + Array.from(deleted.data).length
            }
        }

        // handle the error
        if (error) {
            await logging.sendDiscordError(error, message.member, message.channel as Discord.TextChannel, config)
        } else {
            await (await message.channel.send(`:koala: **Deleted ${deletedCount - 1} messages.**`)).delete({ timeout: 2000 })
        }
    }
}