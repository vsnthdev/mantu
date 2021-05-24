/*
 *  Listen for interaction event and fire the appropriate
 *  command's action.
 *  Created On 12 April 2021
 */

import utilities from '@vasanthdeveloper/utilities'
import { MessageEmbed } from 'discord.js'

import { client, discord } from '~discord'

import restrict from './restrict.js'

const transformArgs = (command, args) => {
    if (!args) return {}

    const cmds = command.split(' ')
    const returnable = {}
    if (cmds.length > 1) {
        const subCmd = args.find(arg => arg.type == 1 && arg.name == cmds.pop())

        if (subCmd.options)
            for (const obj of subCmd.options) returnable[obj.name] = obj.value

        return returnable
    } else {
        for (const obj of args) returnable[obj.name] = obj.value
        return returnable
    }
}

const getCommandStr = inter =>
    (inter.data.options || [])
        .filter(sub => sub.type == 1)
        .reduce(
            (accumulator, current) => `${accumulator} ${current.name}`,
            inter.data.name.toLowerCase(),
        )
        .trim()

export default async () => {
    client.ws.on('INTERACTION_CREATE', async inter => {
        const command = getCommandStr(inter)
        let args = transformArgs(command, inter.data.options || [])

        const cmd = client.cmds.find(cmd => cmd.name == command)

        if (!cmd) {
            // send a card saying that interaction
            // couldn't be found
            return await discord.interactions.send.embed({
                inter,
                embed: new MessageEmbed()
                    .setTitle(`No such command`)
                    .setDescription(
                        `The requested command \`${command}\` cannot be found.`,
                    ),
                ephemeral: true,
            })
        } else {
            try {
                // check if the user is eligible to execute
                // this command
                await restrict({ inter, cmd })
            } catch (err) {
                return
            }

            // validate the arguments if a schema was provided
            if (cmd.schema) {
                const { error, returned } = await utilities.promise.handle(
                    cmd.schema.validateAsync(args),
                )

                if (error) {
                    return await discord.interactions.send.embed({
                        inter,
                        ephemeral: true,
                        embed: new MessageEmbed()
                            .setTitle('Invalid argument provided')
                            .addField(
                                'Argument',
                                error.details[0].context.key,
                                true,
                            )
                            .addField(
                                'Provided',
                                error.details[0].context.value,
                                true,
                            )
                            .addField(
                                'Description',
                                cmd.options.find(
                                    opt =>
                                        opt.name ==
                                        error.details[0].context.key,
                                ).description,
                                true,
                            ),
                    })
                } else {
                    args = returned
                }
            }

            // run the action tied to the requested interaction
            try {
                cmd.action(inter, args)
            } catch (err) {
                // send a card saying the interaction
                // failed due to
                const error = '```javascript\n' + err.toString() + '\n```'

                return await discord.interactions.send.embed({
                    inter,
                    embed: new MessageEmbed()
                        .setTitle('Runtime Exception')
                        .setDescription(error),
                    ephemeral: true,
                })
            }
        }
    })
}
