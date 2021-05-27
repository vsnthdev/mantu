/*
 *  Handles command coolDown functionality.
 *  Created On 27 May 2021
 */

import { MessageEmbed } from 'discord.js'
import { DateTime } from 'luxon'
import NodeCache from 'node-cache'

import { discord } from '~discord'

import { embedColors } from '../utilities/responses.js'

const cache = new NodeCache({
    deleteOnExpire: true,
    checkperiod: 1,
})

export const registerCoolDown = (inter, cmd) => {
    if (!cmd.coolDown) return

    const identifier = cmd.coolDown.identifier
        ? cmd.coolDown.identifier(inter)
        : ''

    cache.set(`${cmd.name}${identifier}`, '1', cmd.coolDown.ttl)
}

export const isHot = (inter, cmd) => {
    if (!cmd.coolDown) return

    const embed = new MessageEmbed()
        .setTitle(`You're too fast!`)
        .setColor(embedColors.red)

    const identifier = cmd.coolDown.identifier
        ? cmd.coolDown.identifier(inter)
        : ''
    const key = `${cmd.name}${identifier}`
    const value = cache.get(key)

    if (value) {
        const ttl = DateTime.fromMillis(cache.getTtl(key)).diffNow([
            'seconds',
            'minutes',
            'hours',
        ])

        const ttlString = [
            ttl.hours ? `${Math.round(ttl.hours)} hours` : '',
            ttl.minutes ? `${Math.round(ttl.minutes)} minutes` : '',
            ttl.seconds ? `${Math.round(ttl.seconds)} seconds` : '',
        ]
            .filter(line => Boolean(line))
            .join(', ')

        discord.interactions.send.embed({
            inter,
            embed: embed.setDescription(
                `Please wait for **${ttlString}** before running the command again.`,
            ),
        })
        throw new Error('command is hot')
    }
}
