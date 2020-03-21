// This file will read the help.md Markdown file and respond with it's contents
// Note: This file will handle both the help and helpMessage commands

import fs from 'fs'
import path from 'path'

import Discord from 'discord.js'
import Conf from 'conf'

import { ConfigImpl, appInfo } from '../config'
import { onlyModerators } from './userActivityInfo'
import diChannels from '../discord/channels'

export default async function respond(command: string, message: Discord.Message, config: Conf<ConfigImpl>): Promise<boolean> {
    // act accordingly
    if (command == 'help') {
        message.channel.send(`:blue_book: **A list of commands and what they do can be found at** <#${config.get('channels').help}>`)
        return true
    } else {
        // only allow mods to access this command
        const access = await onlyModerators(message, config)
        if (access == false) {
            message.channel.send(':beetle: **You don\'t have access to this command.** :person_shrugging:')
            return true
        }

        // delete all the messages in the help channel
        const helpChannel = await diChannels.getHelpChannel(config)
        await helpChannel.bulkDelete(100)

        // insert the new help message
        const helpString = await fs.promises.readFile(path.join(process.cwd(), 'help.md'), { encoding: 'UTF-8' })

        // send the help message
        await helpChannel.send(`${helpString}\n**\`mantu v${appInfo.version}\` **`.replace(/{prefix}/g, config.get('prefix')))

        // notify the user that the help message has been updated.
        message.channel.send(`:blue_book: **The help message has been updated at** <#${config.get('channels').help}>`)
        return true
    }
}