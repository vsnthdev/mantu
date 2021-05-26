/*
 *  Entryfile for mantu bot.
 *  Created On 17 Sep 2020
 */

import config from '~config'
import database from '~database'
import logger from '~logger/app.js'

import api from './api/index.js'
import cmds from './bot/cmds/index.js'
import discord from './bot/discord/index.js'
import tasks from './bot/tasks/index.js'

// tell the user we're running in development mode
// if in case
global.env = process.env.NODE_ENV ? process.env.NODE_ENV : 'development'
if (global.env == 'development')
    logger.warning('The bot is running in development mode')

// load the config
await config()

// connect to the database
// and login to Discord at the same time
const client = (await Promise.all([database.connect(), discord.login()]))[1]

// initialize the operations that run
// periodically
await tasks(client)

// listen for bot commands on Discord
// and start the server at the same time
await Promise.all([cmds(), api()])
