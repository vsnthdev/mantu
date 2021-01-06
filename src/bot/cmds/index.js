/*
 *  This file will listen for commands to the Discord bot and will respond accordingly.
 *  Created On 28 September 2020
 */

import utilities from '@vasanthdeveloper/utilities'
import { MessageEmbed } from 'discord.js'
import fs from 'fs'
import path from 'path'

import { config } from '../../config/index.js'
import logger from '../../logger/app.js'
import discord, { client } from '../discord/index.js'
import hotReload, { addCmd } from './reload.js'

// noCommand() will respond to a user that a command
// of that name was not found, as well as fire a commandNotFound
// event on client
const noCommand = async (cmdString, msg) => {
    client.emit('commandNotFound', cmdString)
    const embed = new MessageEmbed().setDescription(
        `A command with name **"${cmdString}"** does not exist.`,
    )
    await discord.messages.sendEmbed(embed, msg)
}

// listen() will attach the event listener
// so commands get fired.
const listen = () => {
    logger.success('The bot is now online and ready!')
    client.on('message', async msg => {
        if (
            !msg.content.startsWith(config.get('discord.prefix')) ||
            msg.author.bot
        )
            return

        const args = msg.content
            .slice(config.get('discord.prefix').length)
            .trim()
            .split(/ +/)
        const command = args.shift().toLowerCase()
        const cmd = client.cmds.find(c => c.name == command)

        // if command not found, respond with a no
        if (!cmd) {
            noCommand(command, msg)
        } else {
            // fire the command and pass the arguments
            await cmd.action(msg, args)
        }
    })
}

export default async () => {
    client.cmds = []

    // loop through all directories in current directory
    const dir = await fs.promises.readdir(
        path.resolve(path.join('src', 'bot', 'cmds')),
    )
    await utilities.loops.forEach(dir, async dir => {
        const fPath = path.resolve(path.join('src', 'bot', 'cmds', dir))
        const isDirectory = (await fs.promises.stat(fPath)).isDirectory()
        if (isDirectory) await addCmd(path.join(fPath, 'index.js'))
    })

    // enable hot reloading command reloading
    // during development
    hotReload()

    logger.info('Loaded commands into memory')
    listen()
}
