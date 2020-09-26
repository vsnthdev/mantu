/*
 *  This task will loop through all discord members and synchronize
 *  both the databases with the required information.
 *  Created On 24 September 2020
 */

import moment from 'moment'
import utilities from '@vasanthdeveloper/utilities'

import { tasks as logger } from '../../../logger/index.js'
import discord from '../../discord/index.js'
import database from '../../../database/index.js'

const action = async () => {
    const members = await discord.members.getAllMembers()
    const membersInDB = await database.postgres.members.getAll()
    const discordMembers = []

    // loop through everyone from discord
    await utilities.loops.default.forEach(members, async member => {
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
            await database.redis.set(member.user.id, moment().format('x'))
        }
    })

    // loop through all the members in database and delete non-existent ones
    await utilities.loops.default.forEach(membersInDB, async member => {
        const removed = !discordMembers.includes(member.id)
        if (removed) {
            await database.redis.del(member.id)
            await database.postgres.members.del(member.id)
        }
    })
    logger.verbose('Task syncMembers has finished execution')
}

export default async client => {
    // run initially
    await action()

    // schedule the task to run whenever someone changes their username
    // or a new member gets added or removed
    client.on('guildMemberUpdate', action)
}
