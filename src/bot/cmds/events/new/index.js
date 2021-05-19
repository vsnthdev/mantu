/*
 *  Create a new event on the Discord server.
 *  Created On 18 April 2021
 */

import chunk from 'chunk-text'
import { DateTime } from 'luxon'

import { database } from '../../../../database/index.js'
import input from '../../showcase/server/02-input.js'
import create from './01-create.js'
import responses from './02-responses.js'
import description from './03-description.js'
import rolemenu from './04-rolemenu.js'

const action = async (inter, { name, color, emoji }) => {
    // check if the emoji is a unicode character
    if (emoji.match(/^<.*>/g) != null) {
        responses.abort({
            inter,
            operation: 'send',
            reason: `The given emoji ${emoji} is invalid to be used with events. Only unicode emojis are supported.`,
        })
        return
    }

    // ask the user, the timings!
    responses.time({ inter, name, emoji })
    const iTime = await input(inter)
    if (!iTime) return

    const time = DateTime.fromFormat(iTime, 'HH:mm dd-LL-yyyy')

    // handle invalid time
    if (time.isValid == false) {
        responses.abort({
            inter,
            operation: 'update',
            reason: `**The given time \`${iTime}\` is invalid.**\n**Provide time in the format \`HH:mm dd-LL-yyyy\`**\n\n**[Click here](https://moment.github.io/luxon/docs/manual/formatting.html#table-of-tokens) to see formatting help.**`,
        })
        return
    }

    // ask the user for a description
    await responses.desc({ inter, name, emoji })
    let desc = await input(inter)
    if (!desc) return

    // format the description
    desc = chunk(desc.replace(/(\r\n|\n|\r)/gm, ' '), 100).join('\n')

    // tell the user we're working
    await responses.processing({ inter })

    // create the required resource on Discord
    const { role, group, text, stage } = await create({ name, color, emoji })

    // send event details to the newly
    // created text channel
    await description({ text, time, desc })

    // add the newly created event into database
    await database.postgres.events.add({
        name: `${emoji}  ${name}`,
        role,
        group,
        text,
        stage,
    })

    // add the role to our role menu so people
    // can join
    await rolemenu({ name, emoji, role })

    return await responses.completed({ inter, emoji, role, stage, text })
}

export default {
    action,
    description: 'Setup a new event on this server.',
    perms: ['ADMINISTRATOR'],
    options: [
        {
            type: 3,
            name: 'name',
            required: true,
            description: 'The name of the event to be created.',
        },
        {
            type: 3,
            name: 'emoji',
            required: true,
            description: 'Emoji for the event to be created.',
        },
        {
            type: 3,
            name: 'color',
            required: true,
            description: 'Color for the event to be created.',
        },
    ],
}
