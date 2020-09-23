import { database } from './database/index.js'
import { discord } from './bot/discord/index.js'

// connect to the database
await database.connect()

// login to Discord
await discord.login()

// startup order:
//     1. connect to the database
//     2. login to Discord
//     3. start the web server
//     4. run the tasks initially
//     5. run puppeteer automation if required
