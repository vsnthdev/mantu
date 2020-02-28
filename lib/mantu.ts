//   ___    __________   |  Vasanth Developer (Vasanth Srivatsa)
//   __ |  / /___  __ \  |  ------------------------------------------------
//   __ | / / __  / / /  |  https://github.com/vasanthdeveloper/mantu.git
//   __ |/ /  _  /_/ /   |
//   _____/   /_____/    |  Entryfile for mantu project
//                       |

import Discord from 'discord.js'

const config = require('../config.json')
const client = new Discord.Client()

client.once('ready', () => {
    console.log('ready!')
})

client.login(config.token)

client.on('message', (message) => {
    if (message.content.startsWith(config.prefix) == true) {
        const command = message.content.replace(config.prefix, '')
        console.log(command)
    }
})