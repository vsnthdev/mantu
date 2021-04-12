/*
 *  Responds with a random meme from Reddit related to programming.
 *  Created On 11 January 2021
 */

import axios from 'axios'
import { MessageEmbed } from 'discord.js'

import { discord } from '../../discord/index.js'

// we'll pick one depending on the request
const list = {
    default: 'ProgrammerHumor',
    alt: 'techhumor',
    it: 'ITMemes',
    'tech support': 'techsupportmemes',
}

const action = async inter => {
    const req = 'default'

    if (!list[req])
        return await discord.interactions.sendEmbed(
            new MessageEmbed().setDescription(
                `The requested subreddit "${req}" isn't allowed.`,
            ),
            inter,
        )

    // request a sub-reddit in JSON format from Reddit
    let {
        data: {
            data: { children: res },
        },
    } = await axios({
        method: 'GET',
        url: `https://www.reddit.com/r/${list[req]}.json`,
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

    return await discord.interactions.sendEmbed(
        new MessageEmbed()
            .setTitle(meme.title)
            .setURL(meme.url)
            .setImage(meme.thumbnail),
        inter,
    )
}

export default {
    action,
    description: 'A random programming meme from Reddit.',
}
