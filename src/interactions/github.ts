// This file displays information from GitHub

import Discord from 'discord.js'
import GitHub from 'github-api'
import moment from 'moment'
import Conf from 'conf'
import filesize from 'filesize'

import { ConfigImpl } from '../config'
import { errorHandler } from '../utilities/error'

export default async function respond(command: string, message: Discord.Message, config: Conf<ConfigImpl>): Promise<boolean> {
    const parse = command.substring(7).split('/')
    
    // check if that is a valid command string
    if (parse.length > 2) {
        message.channel.send(':beetle: **Invalid input provided. Run for example** `;github vasanthdeveloper/samaya`')
        return false
    }

    // respond with the user's GitHub profile
    // create a new GitHub client
    const git = new GitHub()

    // create the response variable which will be our embed
    const response = new Discord.MessageEmbed()
        .setColor(config.get('embedColor'))
        .setAuthor(message.member.displayName, message.author.displayAvatarURL({
            dynamic: true,
            format: 'webp',
            size: 256
        }))

    // determine if we got a user or a repository
    if (parse.length == 1) {
        // get the user's profile
        const user = await errorHandler((await git.getUser(parse[0])).getProfile())

        // handle if there is an API error
        if (user.e) {
            message.channel.send(`:beetle: **A user with username ${parse[0]} does not exist.**`)
            return false
        }

        // create a rich embed
        response.setTitle(`${user.data.data.name}'s profile on GitHub`)
            .setURL(user.data.data.html_url)
            .setDescription(user.data.data.bio ? user.data.data.bio : 'No bio provided.')
            .setThumbnail(user.data.data.avatar_url ? user.data.data.avatar_url : '')
            .addField('Following', user.data.data.following, true)
            .addField('Followers', user.data.data.followers, true)
            .addField('Joined on', moment(user.data.data.created_at).format('l'), true)
            .addField('Lives in', user.data.data.location ? user.data.data.location : 'Unknown', true)
            .addField('Blog', user.data.data.blog, true)
            .setFooter(`Updated on ${moment(user.data.data.updated_at).format('LL')}`)

        // send the response
        message.channel.send('', {
            embed: response
        })
    } else {
        // it's a repository
        const repo = await errorHandler((await git.getRepo(parse[0], parse[1])).getDetails())

        // handle if there is an API error
        if (repo.e) {
            message.channel.send(`:beetle: **The repository ${parse.join('/')} could not be found.**`)
            return false
        }

        // create a rich embed
        response.setTitle(`${repo.data.data.name} on GitHub`)
            .setURL(repo.data.data.html_url)
            .setDescription(repo.data.data.description)
            .addField('Language', repo.data.data.language, true)
            .addField('Created On', moment(repo.data.data.created_at).format('l'), true)
            .addField('Branch', repo.data.data.default_branch, true)
            .addField('Author', `[${repo.data.data.owner.login}](${repo.data.data.owner.html_url})`, true)
            .addField('Size', filesize((repo.data.data.size * 1000)), true)
            .addField('License', repo.data.data.license.spdx_id == 'NOASSERTION' ? 'Unknown' : repo.data.data.license.spdx_id, true)
            .addField('Links', `${(repo.data.data.homepage) ? `[Homepage](${repo.data.data.homepage}) | ` : ''}[Issues](${repo.data.data.html_url}/issues) | [Pull Requests](${repo.data.data.html_url}/pulls)${(repo.data.data.has_wiki) ? ` | [Wiki](${repo.data.data.html_url}/wiki)` : ''}`)
            .setFooter(`Pushed on ${moment(repo.data.data.pushed_at).format('LL')}`)
        
        // send the response
        message.channel.send('', {
            embed: response
        })
    }
    
    return true
}