/*
 *  This file will initialize with default values incase they don't exist.
 *  Created On 19 September 2020
 */

export default config => {
    // the set function to not repeat the same code
    const set = (name, value) =>
        config.get(name) == undefined ? config.set(name, value) : true

    // database defaults
    set('database.postgres.host', '127.0.0.1')
    set('database.postgres.port', 5432)
    set('database.postgres.name', 'mantu')
    set('database.postgres.username', process.env.USER)
    set('database.postgres.password', null)

    set('database.redis.host', '127.0.0.1')
    set('database.redis.port', 6379)
    set('database.redis.channel', 6)
    set('database.redis.password', null)

    // web server defaults
    set('server.host', '127.0.0.1')
    set('server.port', 45103)

    // discord settings
    set('discord.token', null)
    set('discord.prefix', 'm ')
    set('discord.server', '690044914444009508')
    set('tasks.syncMembers', null)

    return config
}
