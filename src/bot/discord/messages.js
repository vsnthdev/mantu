/*
 *  This file interfaces with messages on a Discord server.
 *  Created On 01 October 2020
 */

import fs from 'fs'
import path from 'path'

const require = (filepath, encoding = 'utf8') =>
    JSON.parse(fs.readFileSync(filepath, { encoding }))

const { version } = require(path.join(path.resolve(), 'package.json'))

const sendEmbed = async (embed, msg) => {
    embed
        .setColor(msg.guild.me.displayColor)
        .setAuthor(
            msg.member.displayName,
            msg.author.displayAvatarURL({
                dynamic: true,
                format: 'webp',
                size: 256,
            }),
        )
        .setTimestamp()
        .setFooter(`mantu v${version}`)
    return await msg.channel.send(embed)
}

export default {
    sendEmbed,
}
