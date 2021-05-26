/*
 *  Connects to Todoist's API and adds a todo item.
 *  Created On 26 May 2021
 */

import utilities from '@vasanthdeveloper/utilities'
import axios from 'axios'
import { MessageEmbed } from 'discord.js'

import { config } from '~config'
import { discord } from '~discord'

import { embedColors } from '../../utilities/responses.js'

const addTask = async content =>
    await utilities.promise.handle(
        axios({
            method: 'POST',
            url: 'https://api.todoist.com/rest/v1/tasks',
            headers: {
                Authorization: `Bearer ${config.get('todoist.token')}`,
            },
            data: {
                content,
                due_string: 'Today',
                due_lang: 'en',
            },
        }),
    )

const action = async (inter, { task }) => {
    // handle if Todoist token doesn't exist
    if (Boolean(config.get('todoist.token')) == false)
        return await discord.interactions.send.embed({
            inter,
            ephemeral: true,
            embed: new MessageEmbed()
                .setTitle('No Todoist token')
                .setColor(embedColors.red),
        })

    // add the task to my Todoist
    const { error } = await addTask(task)

    // handle Todoist communication errors
    if (error)
        return await discord.interactions.send.embed({
            inter,
            ephemeral: true,
            embed: new MessageEmbed()
                .setTitle(
                    `Failed with code (${error.response.statusText}) ${error.response.status}`,
                )
                .setColor(embedColors.red),
        })

    // respond to the interaction
    return await discord.interactions.send.embed({
        inter,
        ephemeral: true,
        embed: new MessageEmbed()
            .setTitle('Added todo')
            .setColor(embedColors.green),
    })
}

export default {
    action,
    description: 'Add a personal todo item.',
    options: [
        {
            type: 3,
            name: 'task',
            required: true,
            description: 'The task to be added to Todoist',
        },
    ],
}
