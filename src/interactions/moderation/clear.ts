// This file will clear the previous messages

import Discord from 'discord.js'
import Conf from 'conf'

import { errorHandler } from '../../utilities/error'
import { ConfigImpl } from '../../config'
import diModerators from '../../discord/moderators'
import logging from '../../discord/logging'
import { sendMessage, getRandomEmoji } from '../../discord/discord'

export default async function respond(command: string, message: Discord.Message, config: Conf<ConfigImpl>): Promise<void> {
    const parsed = parseInt(command.substring(6))

    // check if we got an actual number
    if (isNaN(parsed)) {
        sendMessage(`${getRandomEmoji(false)} Invalid number provided with clear command.`, message.channel)
    } else {
        // only allow mods to access this command
        const access = await diModerators.onlyModerators(message, config)
        if (access == false) return

        // check if the parsed number is zero!
        if (parsed <= 0) {
            sendMessage(`${getRandomEmoji(false)} Do you think I am stupid?`, message.channel)
            return
        }

        // check if parsed is equal to or below 1000
        if (parsed >= 1000) {
            sendMessage(`${getRandomEmoji(false)} Deleting more than 1000 messages isn't supported.`, message.channel)
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
            await (await sendMessage(`${getRandomEmoji(true)} Deleted ${deletedCount - 1} messages.`, message.channel)).delete({ timeout: 2000 })
        }
    }
}