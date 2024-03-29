/*
 *  Responds with a random meme from Reddit related to programming.
 *  Created On 11 January 2021
 */

import axios from 'axios'
import { MessageEmbed } from 'discord.js'

import { discord } from '~discord'

const subReddit = [
    'ProgrammerHumor',
    'techhumor',
    'ITMemes',
    'techsupportmemes',
    'linuxmemes',
    'applememes',
    'windowsmemes',
]

const action = async (inter, { subreddit }) => {
    subreddit = subreddit || subReddit[0]

    // request a sub-reddit in JSON format from Reddit
    let {
        data: {
            data: { children: res },
        },
    } = await axios({
        method: 'GET',
        url: `https://www.reddit.com/r/${subreddit}.json`,
    })

    // remove 18+, and keep only
    // Reddit image ones
    res = res.map(post => post.data)
    res = res.filter(post => !post.is_video)
    res = res.filter(post => !post.over_18)
    res = res.filter(post => !post.media)
    res = res.filter(post => post.url.includes('redd.it'))

    // remove all keys that we don't need
    res = res.map(post => {
        return {
            url: `https://reddit.com${post.permalink}`,
            title: post.title,
            thumbnail: post.url,
        }
    })

    const meme = res[Math.floor(Math.random() * res.length)]

    return await discord.interactions.send.embed({
        inter,
        embed: new MessageEmbed()
            .setTitle(meme.title)
            .setURL(meme.url)
            .setImage(meme.thumbnail),
    })
}

export default {
    action,
    description: 'Want a random programming meme from Reddit?',
    coolDown: {
        ttl: 14400,
    },
    options: [
        {
            name: 'subreddit',
            description: 'The subreddit to get meme from.',
            type: 3,
            choices: subReddit.map(name => {
                return { name, value: name }
            }),
        },
    ],
}
