import api from './api/index.js'
import cmds from './bot/cmds/index.js'
import discord from './bot/discord/index.js'
import tasks from './bot/tasks/index.js'
import config from './config/index.js'
import database from './database/index.js'
import logger from './logger/app.js'

// tell the user we're running in development mode
// if in case
global.env = process.env.NODE_ENV ? process.env.NODE_ENV : 'development'
if (global.env == 'development')
    logger.warning('The bot is running in development mode')

// load the config
await config()

// connect to the database
await database.connect()

// login to Discord
const client = await discord.login()

// initialize the operations that run
// periodically
await tasks(client)

// listen for bot commands on Discord
await cmds()

// start the API server
await api()

// startup order:
//     1. connect to the database
//     2. login to Discord
//     3. start the web server
//     4. run the tasks initially
