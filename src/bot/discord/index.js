/*
 *  This file will login to Discord's Webhook connections and make the bot online
 *  while default exporting the client to be used in other files in this directory.
 *  Created On 23 September 2020
 */

import djs from 'discord.js'

import { app as logger } from '../../logger/index.js'
import config from '../../config/index.js'
import roles from './roles.js'
import members from './members.js'
import messages from './messages.js'

export let client

// login on Discord
const login = () => {
    return new Promise(resolve => {
        client = new djs.Client()

        client.on('ready', () => {
            logger.info('Finished logged into Discord')
            resolve(client)
        })

        client
            .login(config.get('discord.token'))
            .catch(err =>
                logger.error(
                    `Couldn't login to Discord due to 👇\n${err.message}`,
                    2,
                ),
            )
    })
}

// logout on Discord
const logout = async () => {
    //
}

export const discord = { login, logout }
export default {
    roles,
    members,
    messages,
}
