/*
 *  A list of functions related to guilds.
 *  Created On 11 April 2021
 */

import { config } from '~config'

import { client } from './index.js'

const getGuild = async () =>
    await client.guilds.cache.get(config.get('discord.server'))

export default {
    getGuild,
}
