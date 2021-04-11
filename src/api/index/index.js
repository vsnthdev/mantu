/*
 *  This file will redirect to a working Discord invite link.
 *  Created On 06 January 2021
 */

import boom from '@hapi/boom'
import utilities from '@vasanthdeveloper/utilities'
import axios from 'axios'
import Joi from 'joi'

import { discord } from '../../bot/discord/index.js'
import { config } from '../../config/index.js'

// inviteCode is a temporary variable that
// is stored until the application is running
let inviteCode

const isValid = async code => {
    const res = await utilities.promise.handle(
        axios({
            method: 'GET',
            url: `https://discordapp.com/api/invite/a${code}`,
        }),
    )

    if (res.error) return false
    if (res.returned.status !== 200) return false
    return true
}

const newCode = async () => {
    // create a new one!
    const channel = await discord.channels.getChannel(
        config.get('discord.invite.channel'),
    )

    // handle if channel doesn't exist
    if (!channel)
        throw boom.notFound('The configured invite channel was not found')

    // create a new invite link
    const invite = await channel.createInvite({
        maxAge: 1 * 60 * 30,
        reason: `Created by mantu's API`,
    })

    // return the code
    return invite.code
}

const handler = async (req, h) => {
    if (inviteCode) {
        // check if it's valid
        // if the code is invalid, just make a new one!
        if ((await isValid(inviteCode)) == false) inviteCode = await newCode()
    } else {
        inviteCode = await newCode()
    }

    if (req.query.type == 'json') {
        return {
            status: 200,
            code: inviteCode,
            link: `https://discord.gg/${inviteCode}`,
        }
    } else {
        return h.redirect(`https://discord.gg/${inviteCode}`).code(307)
    }
}

export default {
    handler,
    method: 'GET',
    path: '/',
    options: {
        validate: {
            query: Joi.object({
                type: Joi.string().valid('direct', 'json').default('direct'),
            }),
        },
    },
}
