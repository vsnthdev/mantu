/*
 *  Kicks people with a friendly DM if they're inactive for 50+ days.
 *  Created On 13 April 2021
 */

import { DateTime } from 'luxon'

import { database } from '../../../database/index.js'
import { discord } from '../../discord/index.js'
import kick from './kick.js'

const action = async () => {
    // get everyone on Discord
    const everyone = await discord.members.getAllMembers(false, false)

    // check if they exist on database
    for (const member of everyone) {
        const lastEpoch = await database.redis.get(member.id)

        // get how many days they're inactive
        let { days } = DateTime.fromMillis(+lastEpoch)
            .diffNow('day', {
                conversionAccuracy: 'casual',
            })
            .toObject()

        // convert to a positive number
        days = days * -1
        days = Math.round(days)

        // kick them!
        if (days >= 50) await kick(member, days)
    }
}

export default async () => {
    // run initially
    await action()

    const refresh = global.env == 'development' ? 30000 : 3600 * 1000
    setInterval(action, refresh)
}
