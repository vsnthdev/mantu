/*
 *  Kicks people with a friendly DM if they're inactive for 50+ days.
 *  Created On 13 April 2021
 */

import { DateTime } from 'luxon'

import { database } from '~database'
import { discord } from '~discord'

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
        // due to some unknown error, the number
        // sometimes goes to 18731 in which case
        // we want to prevent mantu from accidentally
        // kicking everyone 😬
        if (days >= 50 && days <= 1000) await kick(member, days)
    }
}

export default async () => {
    // run initially
    action()

    const refresh = global.env == 'development' ? 30000 : 3600 * 1000
    setInterval(action, refresh)
}
