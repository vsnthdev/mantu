import { cmds } from './bot/cmds/index.js'
import { discord } from './bot/discord/index.js'
import { tasks } from './bot/tasks/index.js'
import { database } from './database/index.js'
import { app, app as logger } from './logger/index.js'

// tell the user we're running in development mode
// if in case
if (
    (process.env.NODE_ENV ? process.env.NODE_ENV : 'development') ==
    'development'
)
    app.warning('The bot is running in development mode.')

// connect to the database
await database.connect()

// login to Discord
const client = await discord.login()

// initialize the operations that run
// periodically
await tasks(client)

// listen for bot commands on Discord
await cmds()

// startup order:
//     1. connect to the database
//     2. login to Discord
//     3. start the web server
//     4. run the tasks initially
//     5. run puppeteer automation if required
