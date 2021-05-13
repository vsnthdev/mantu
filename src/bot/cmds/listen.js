/*
 *  Listen for interaction event and fire the appropriate
 *  command's action.
 *  Created On 12 April 2021
 */

import { MessageEmbed } from 'discord.js'

import { client, discord } from '../discord/index.js'

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
        const args = transformArgs(command, inter.data.options || [])

        const cmd = client.cmds.find(cmd => cmd.name == command)

        if (!cmd) {
            // send a card saying that interaction
            // couldn't be found
            return await discord.interactions.send.embed({
                inter,
                embed: new MessageEmbed()
                    .setTitle(`404! Couldn't Locate The Universe`)
                    .setDescription(
                        `The requested command \`${command}\` cannot be found.`,
                    ),
                ephemeral: true,
            })
        } else {
            // check for permissions
            if (cmd.perms) {
                const member = await discord.members.get(inter.member.user.id)

                for (const perm of cmd.perms) {
                    if (member.hasPermission(perm) == false) {
                        return await discord.interactions.send.embed({
                            inter,
                            embed: new MessageEmbed()
                                .setTitle(`I'm afraid I don't know you.`)
                                .setDescription(
                                    `The following command requires **${perm}** permission which you don't seem to have 🤷‍♂️`,
                                ),
                            ephemeral: true,
                        })
                    }
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
