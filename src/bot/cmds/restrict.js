/*
 *  Check if a given user is eligible to execute
 *  a given command.
 *  Created On 24 May 2021
 */

import { MessageEmbed } from 'discord.js'

import { discord } from '~discord'
import logger from '~logger/app.js'
import { restrict } from '~restrict'

import { embedColors } from '../utilities/responses.js'

const getEmbed = async ({
    inter,
    cmd,
    data: { perm, role, user, channel },
}) => {
    const restrictHelp = cmd.restrictHelp != undefined ? cmd.restrictHelp : true

    const perms = perm.join(' ')
    const roles = role.map(r => `<@&${r}>`).join(' ')
    const users = user.map(u => `<@${u}>`).join(' ')
    const channels = channel.map(c => `<#${c}>`).join(' ')

    const embed = new MessageEmbed()
        .setTitle(`Restricted Access`)
        .setColor(embedColors.red)

    if (restrictHelp) {
        embed.setDescription(
            'Command is restricted to only run in the following conditions',
        )

        if (users) embed.addField('Users', users, true)
        if (roles) embed.addField('Roles', roles, true)
        if (perms) embed.addField('Permissions', perms, true)
        if (channels) embed.addField('Channels', channels, true)
    }

    discord.interactions.send.embed({
        inter,
        embed,
    })
}

// perm = permission from Discord
const perm = async ({ inter, cmd, values }) => {
    for (const value of values) {
        const member = await discord.members.get(inter.member.user.id)
        const has = member.hasPermission(value.toUpperCase())

        if (has == false)
            throw new Error(
                `User ${inter.member.user.username} doesn't have enough permissions to run "${cmd.name}" command`,
            )
    }
}

// channel = the channel to run
const channel = async ({ inter, cmd, values }) => {
    if (values.length < 1) return
    const channel = await discord.channels.get(inter.channel_id)

    if (values.includes(inter.channel_id) == false)
        throw new Error(
            `${channel.name} channel is not an appropriate channel to run "${cmd.name}" command`,
        )
}

// user = the user to run
const user = async ({ inter, cmd, values }) => {
    if (values.length < 1) return

    if (values.includes(inter.member.user.id) == false)
        throw new Error(
            `User ${inter.member.user.username} is forbidden to run "${cmd.name}" command`,
        )
}

// role = role ID to be have
const role = async ({ inter, cmd, values }) => {
    if (values.length < 1) return

    const member = await discord.members.get(inter.member.user.id)
    for (const id of values) {
        if (member.roles.cache.has(id) == false)
            throw new Error(
                `User ${inter.member.user.username} doesn't have the required roles to run "${cmd.name}" command`,
            )
    }
}

export default async ({ inter, cmd }) => {
    // return if no restrict field was provided
    // in that case the command was open
    const restrictArray = (cmd.restrict || []).concat(
        restrict.get(cmd.name) || [],
    )
    if (restrictArray.length < 1) return

    // loop through this restrictArray and convert it into
    // an object
    const restrictObj = {
        perm: [],
        role: [],
        user: [],
        channel: [],
    }

    for (const str of restrictArray) {
        const criteria = str.substr(0, str.indexOf(':'))
        const value = str.substr(str.indexOf(':') + 1)

        if (!restrictObj[criteria]) {
            logger.error(
                `Invalid restrict criteria "${criteria}" for command "${cmd.name}"`,
            )
            throw new Error('invalid criteria')
        }

        restrictObj[criteria].push(value)
    }

    try {
        await Promise.all([
            perm({ inter, cmd, values: restrictObj.perm }),
            channel({ inter, cmd, values: restrictObj.channel }),
            user({ inter, cmd, values: restrictObj.user }),
            role({ inter, cmd, values: restrictObj.role }),
        ])
    } catch (err) {
        logger.verbose(err.message)
        await getEmbed({ inter, cmd, data: restrictObj })
        throw err
    }
}
