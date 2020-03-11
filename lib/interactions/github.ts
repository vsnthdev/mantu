// This file displays information from GitHub

import Discord from 'discord.js'
import GitHub from 'github-api'

export default async function respond(command: string, message: Discord.Message): Promise<boolean> {
    const parse = command.substring(7).split('/')
    
    // check if that is a valid command string
    if (parse.length > 2) {
        message.channel.send(':beetle: **Invalid input provided. Run for example** `;github vasanthdeveloper/samaya`')
        return false
    }

    // determine if we got a user or a repository
    if (parse.length == 1) {
        // respond with the user's GitHub profile
        // create a new GitHub client
        const git = new GitHub()

        // get the user's profile
        const user = (await (await git.getUser(parse[0])).getProfile()).data

        console.log(user)
    } else {
        // it's a repository
    }
    
    return false
}