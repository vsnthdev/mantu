/*
 *  This file contains default values for config file.
 *  Created On 19 September 2020
 */

export default config => {
    // the set function to not repeat the same code
    const set = (name, value) =>
        config.get(name) == undefined ? config.set(name, value) : true

    // database
    set('database.postgres.host', '127.0.0.1')
    set('database.postgres.port', 5432)
    set('database.postgres.user', process.env.USER || 'vasanth')
    set('database.postgres.database', 'mantu')
    set('database.postgres.password', null)
    set('database.redis.host', '127.0.0.1')
    set('database.redis.port', 6379)
    set('database.redis.channel', 6)
    set('database.redis.password', null)

    // server
    set('server.host', 'localhost')
    set('server.port', 2020)

    // discord
    set(
        'discord.token',
        'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
    )
    set('discord.server', '690044914444009508')
    set('discord.invite', 'https://vas.cx/discord')

    // Discord Roles
    set('discord.roles.identifer.moderator', 'xxxxxxxxxxxxxxxxxx')

    // Discord Channels
    set('discord.channels.settings.sep', '｜')
    set('discord.channels.positions.events', 0)
    set('discord.channels.identifiers.logs', 'xxxxxxxxxxxxxxxxxx')
    set('discord.channels.identifiers.roles', 'xxxxxxxxxxxxxxxxxx')
    set('discord.channels.identifiers.invite', 'xxxxxxxxxxxxxxxxxx')
    set('discord.channels.identifiers.eventsReminders', 'xxxxxxxxxxxxxxxxxx')
    set('discord.channels.identifiers.showcase.server', 'xxxxxxxxxxxxxxxxxx')

    // Discord server events
    set('discord.events.autoClean', true)
}
