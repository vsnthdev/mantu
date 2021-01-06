/*
 *  This task will loop through all discord members and synchronize
 *  both the databases with the required information.
 *  Created On 24 September 2020
 */

import utilities from '@vasanthdeveloper/utilities'
import { DateTime } from 'luxon'

import { config } from '../../../config/index.js'
import { database } from '../../../database/index.js'
import logger from '../../../logger/tasks.js'
import { discord } from '../../discord/index.js'

const action = async () => {
    const role = await discord.roles.getRoleByName(
        config.get('discord.tasks.syncMembers'),
    )

    const members = Array.from(role.members.values())

    const membersInDB = await database.postgres.members.getAll()
    const discordMembers = []

    // loop through everyone from discord
    await utilities.loops.forEach(members, async member => {
        const exists = await database.postgres.members.getMemberBy.Id(
            member.user.id,
        )
        discordMembers.push(member.user.id)

        if (exists) {
            // update the values which have been changed
            if (
                exists.identifier !=
                `${member.user.username}#${member.user.discriminator}`
            )
                await database.postgres.members.updateId(member)
        } else {
            await database.postgres.members.add(member)
            await database.redis.set(
                member.user.id,
                DateTime.local().toFormat('x'),
            )
        }
    })

    // loop through all the members in database and delete non-existent ones
    await utilities.loops.forEach(membersInDB, async member => {
        const removed = !discordMembers.includes(member.id)
        if (removed) {
            await database.redis.del(member.id)
            await database.postgres.members.del(member.id)
        }
    })
    logger.verbose('Task syncMembers has finished execution')
}

const updateMemberActivity = async member => {
    // sometimes, member is null for
    // some reason 🤷‍♂️
    if (!member) return

    // only work for this current server
    // defined in the config
    if (!(await discord.members.isInServer(member))) return

    // check if the author has the syncMember's role
    if (
        !member.roles.cache.find(
            role => role.name == config.get('discord.tasks.syncMembers'),
        )
    )
        return

    // update their time in the database
    await database.redis.set(member.user.id, DateTime.local().toFormat('x'))
}

export default async client => {
    // run initially
    await action()

    // schedule the task to run whenever someone changes their username
    // or a new member gets added or removed
    client.on('guildMemberUpdate', action)

    // schedule a subtask when activity happens on the server
    // the Redis database gets updated
    client.on('message', msg => updateMemberActivity(msg.member))
    client.on('messageDelete', msg => updateMemberActivity(msg.member))
    client.on('messageReactionAdd', reaction =>
        updateMemberActivity(reaction.message.member),
    )
    client.on('messageReactionRemove', reaction =>
        updateMemberActivity(reaction.message.member),
    )
    client.on('messageUpdate', (_, msg) => updateMemberActivity(msg.member))
    client.on('presenceUpdate', (_, presence) =>
        updateMemberActivity(presence.member),
    )
}
