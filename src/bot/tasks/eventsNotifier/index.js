/*
 *  Notify at regular intervals when an event is scheduled.
 *  Created On 20 May 2021
 */

import { DateTime } from 'luxon'

import { config } from '../../../config/index.js'
import { database } from '../../../database/index.js'
import logger from '../../../logger/tasks.js'
import wrap from '../../cmds/events/wrap/index.js'
import { discord } from '../../discord/index.js'
import responses from './responses.js'

// notify about a scheduled event
// on that day, then before an hour

const action = async channel => {
    // get all events
    const events = await database.postgres.events.list()

    // loop through all each event
    for (const event of events) {
        const hours =
            Math.round(
                DateTime.fromMillis(Number(event.starts)).diffNow('hours')
                    .hours,
            ) * -1

        // handle when an event has expired
        // so we can auto clean it
        if (config.get('discord.events.autoClean') && hours <= -8)
            wrap.action(null, { id: event.role })

        // send a message 24 hours before
        if (event.notified < 1 && hours >= 24) {
            responses.early(channel, event)
            database.postgres.events.notified(event)
            continue
        }

        // send a message 8 hours before
        if (event.notified < 2 && hours >= 8) {
            responses.day(channel, event)
            database.postgres.events.notified(event)
            continue
        }

        // send a message 1 hour before
        if (event.notified < 3 && hours >= 1) {
            responses.hour(channel, event)
            database.postgres.events.notified(event)
            continue
        }
    }
}

export default async () => {
    ;(async () => {
        // check if a eventsReminders channel has been specified
        const channel = await discord.channels.get(
            config.get('discord.channels.identifiers.eventsReminders'),
        )

        if (channel) {
            // run initially
            action(channel)

            // run every 4 minutes
            setInterval(action, 240000, channel)
        } else {
            logger.warning(
                'eventsNotifier task will be disabled because no eventsReminders channel was provided',
            )
        }
    })()
}
