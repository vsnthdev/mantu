/*
 *  Get stats on the current active server.
 *  Created On 19 May 2021
 */

import { discord } from '../../bot/discord/index.js'
import { database } from '../../database/index.js'

const handler = async () => {
    const guild = await discord.guilds.getGuild()
    let events = await database.postgres.events.list()
    events = events.map(event => event.name)

    return {
        events,
        counts: {
            members: guild.members.cache.filter(mem => mem.user.bot == false)
                .size,
            online: guild.members.cache.filter(
                mem =>
                    mem.user.bot == false &&
                    mem.user.presence.status == 'online',
            ).size,
            channels: {
                text: guild.channels.cache.filter(c => c.type === 'text').size,
                voice: guild.channels.cache.filter(c => c.type === 'voice')
                    .size,
            },
        },
    }
}

export default {
    handler,
    method: 'GET',
    path: '/',
}
