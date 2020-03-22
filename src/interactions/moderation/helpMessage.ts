// This file will read the help.md Markdown file and respond with it's contents
// Note: This file will handle both the help and helpMessage commands

import fs from 'fs'
import path from 'path'

import Discord from 'discord.js'
import Conf from 'conf'

import { ConfigImpl, appInfo } from '../../config'
import diModerators from '../../discord/moderators'
import diChannels from '../../discord/channels'
import diEmojis from '../../discord/emojis'
import { sendMessage, getRandomEmoji } from '../../discord/discord'

export default async function respond(command: string, message: Discord.Message, config: Conf<ConfigImpl>): Promise<boolean> {
    // act accordingly
    if (command == 'help') {
        sendMessage(`${getRandomEmoji(true)} A list of commands and what they do can be found at <#${config.get('channels').help}>`, message.channel)
        return true
    } else {
        // only allow mods to access this command
        const access = await diModerators.onlyModerators(message, config)
        if (access == false) return false

        // delete all the messages in the help channel
        const helpChannel = await diChannels.getHelpChannel(config)
        await helpChannel.bulkDelete(100)

        // insert the new help message
        let helpString = await fs.promises.readFile(path.join(process.cwd(), 'help.md'), { encoding: 'UTF-8' }) as string
        helpString = await diEmojis.renderString(helpString)

        // send the help message
        await helpChannel.send(`${helpString}**\`mantu v${appInfo.version}\` **`.replace(/{prefix}/g, config.get('prefix')))

        // notify the user that the help message has been updated.
        sendMessage(`${getRandomEmoji(true)} The help message has been updated at <#${config.get('channels').help}>`, message.channel)
        return true
    }
}