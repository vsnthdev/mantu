/*
 *  This file will update the Discord bot's status.
 *  Created On 05 January 2021
 */

import logger from '../../../../logger/tasks.js'
import { client } from '../../../discord/index.js'

// the list of presences
// 0 = PLAYING
// 1 = STREAMING
// 2 = LISTENING
// 3 = WATCHING
const presences = [
    [3, 'this server.'],
    [3, 'for a command.'],
    [0, 'with cupcakes.'],
    [0, 'with fire.'],
    [0, 'in the waves.'],
    [0, 'with a magnet.'],
    [0, 'with a dolphin.'],
    [0, 'with a koala.'],
    [2, 'music.'],
    [2, 'the internet.'],
]

const action = async () => {
    // pick a random presence
    const presence = presences[Math.floor(Math.random() * presences.length)]

    client.user.setPresence({
        status: 'online',
        activity: {
            name: presence[1],
            type: presence[0],
            url: 'https://vasanth.tech',
        },
    })
}

export default async () => {
    // run initially
    action()

    // schedule this action every 30 seconds
    setInterval(action, 30000)

    logger.verbose('Task presenceUpdate has finished execution')
}
