/*
 *  This file will login to Discord's Webhook connections and make the bot online
 *  while default exporting the client to be used in other files in this directory.
 *  Created On 23 September 2020
 */

import djs from 'discord.js'

import logger from '../../logger/index.js'
import config from '../../config/index.js'

let client

// login on Discord
const login = () => {
    return new Promise(resolve => {
        client = new djs.Client()

        client.on('ready', () => {
            logger.info('Finished logged into Discord')
            resolve()
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
