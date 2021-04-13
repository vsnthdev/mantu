/*
 *  Listen for interaction event and fire the appropriate
 *  command's action.
 *  Created On 12 April 2021
 */

import { MessageEmbed } from 'discord.js'

import { client, discord } from '../discord/index.js'

const transformArgs = args => {
    if (!args) return {}

    const returnable = {}
    for (const obj of args) returnable[obj.name] = obj.value
    return returnable
}

export default async () => {
    client.ws.on('INTERACTION_CREATE', async inter => {
        const command = inter.data.name.toLowerCase()
        const args = inter.data.options

        const cmd = client.cmds.find(cmd => cmd.name == command)

        if (!cmd) {
            // send a card saying that interaction
            // couldn't be found
            return await discord.interactions.sendEmbed(
                new MessageEmbed()
                    .setTitle(`404! Couldn't Locate The Universe`)
                    .setDescription(
                        `The requested command \`${command}\` cannot be found.`,
                    ),
                inter,
            )
        } else {
            try {
                cmd.action(inter, transformArgs(args))
            } catch (err) {
                // send a card saying the interaction
                // failed due to
                const error = '```javascript\n' + err.toString() + '\n```'

                return await discord.interactions.sendEmbed(
                    new MessageEmbed()
                        .setTitle('Runtime Exception')
                        .setDescription(error),
                    inter,
                )
            }
        }
    })
}
