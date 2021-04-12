/*
 *  Listen for interaction event and fire the appropriate
 *  command's action.
 *  Created On 12 April 2021
 */

import { client } from '../discord/index.js'

export default async () => {
    client.ws.on('INTERACTION_CREATE', async inter => {
        const command = inter.data.name.toLowerCase()
        const args = inter.data.options

        const cmd = client.cmds.find(cmd => cmd.name == command)

        if (!cmd) {
            // send a card saying that interaction
            // couldn't be found
        } else {
            try {
                cmd.action(inter, args)
            } catch (err) {
                // send a card saying the interaction
                // failed due to
            }
        }
    })
}
