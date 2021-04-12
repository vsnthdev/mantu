/*
 *  This file interfaces with messages on a Discord server.
 *  Created On 01 October 2020
 */

import fs from 'fs'
import path from 'path'

import { discord } from './index.js'

const require = (filepath, encoding = 'utf8') =>
    JSON.parse(fs.readFileSync(filepath, { encoding }))

const { version } = require(path.join(path.resolve(), 'package.json'))

export const transformEmbed = async embed => {
    const guild = await discord.guilds.getGuild()

    return embed
        .setColor(guild.me.displayColor)
        .setTimestamp()
        .setFooter(`mantu v${version}`)
}

const sendEmbed = async (embed, msg) =>
    await msg.channel.send(await transformEmbed(embed))

export default {
    sendEmbed,
}
