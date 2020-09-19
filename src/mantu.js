import logger from './logger/index.js'

logger.info('hey 👋')

// startup order:
//     1. connect to the database
//     2. login to Discord
//     3. start the web server
//     4. run the tasks initially
//     5. run puppeteer automation if required
