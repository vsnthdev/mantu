/*
 *  This file will login to Discord's Webhook connections and make the bot online
 *  while default exporting the client to be used in other files in this directory.
 *  Created On 23 September 2020
 */

import djs from 'discord.js'

import { config } from '../../config/index.js'
import logger from '../../logger/app.js'
import channels from './channels.js'
import guilds from './guilds.js'
import interactions from './interactions.js'
import members from './members.js'
import messages from './messages.js'
import roles from './roles.js'

export let client

// login on Discord
const login = () => {
    return new Promise(resolve => {
        client = new djs.Client()

        // upon the ready even, we load all the commands
        client.on('ready', () => {
            logger.info('Finished logging into Discord')
            resolve(client)
        })

        // this will trigger the ready event
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

export const discord = {
    roles,
    messages,
    members,
    channels,
    guilds,
    interactions,
}
export default {
    login,
    logout,
}
