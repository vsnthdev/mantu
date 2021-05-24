/*
 *  Check if a given user is eligible to execute
 *  a given command.
 *  Created On 24 May 2021
 */

import { MessageEmbed } from 'discord.js'

import { discord } from '../discord/index.js'

// channel = the channel to run
// user = the user to run
// role = role ID to be have

// perm = permission from Discord
const perm = async ({ inter, value }) => {
    const member = await discord.members.get(inter.member.user.id)
    const has = member.hasPermission(value.toUpperCase())

    if (has == false) {
        discord.interactions.send.embed({
            inter,
            ephemeral: true,
            embed: new MessageEmbed()
                .setTitle(`I'm afraid I don't know you.`)
                .setDescription(
                    `The following command requires **${value.toUpperCase()}** permission which you don't seem to have 🤷‍♂️`,
                ),
        })
        throw new Error(`Permission not found`)
    }
}

export default async ({ inter, cmd }) => {
    // return if no restrict field was provided
    // in that case the command was open
    const { restrict } = cmd
    if (!restrict) return

    // check for permissions
    for (const str of restrict) {
        const criteria = str.substr(0, str.indexOf(':'))
        const value = str.substr(str.indexOf(':') + 1)

        if (criteria == 'perm') {
            await perm({ inter, value })
        }
    }
}
