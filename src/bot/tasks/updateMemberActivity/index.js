/*
 *  This task will update a member's last activity in Redis database.
 *  Created On 26 September 2020
 */

import moment from 'moment'

import config from '../../../config/index.js'
import database from '../../../database/index.js'
import logger from '../../../logger/tasks.js'

const action = async member => {
    // check if the message came from a real human
    // check if the author has the baseRole
    // update his/her time in the database
    if (member.user.bot) return
    if (!member.roles.cache.some(r => r.id == config.get('discord.baseRole')))
        return

    await database.redis.set(member.user.id, moment().format('x'))
    logger.verbose('Task updateMemberActivity has finished execution')
}

export default async client => {
    // as we don't run this task when the bot starts,
    // we move on to directly schedule it
    client.on('message', message => action(message.member))
    client.on('presenceUpdate', (_, presence) => action(presence.member))
}
