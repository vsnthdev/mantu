// This file displays information from GitHub

import Discord from 'discord.js'
import GitHub from 'github-api'
import moment from 'moment'
import Conf from 'conf'
import filesize from 'filesize'
import openGraph from 'open-graph-scraper'

import { ConfigImpl, appInfo } from '../../config'
import { errorHandler } from '../../utilities/error'
import { sendMessage, getRandomEmoji } from '../../discord/discord'

export default async function respond(command: string, message: Discord.Message, config: Conf<ConfigImpl>): Promise<boolean> {
    const parse = command.substring(7).split('/')
    
    // check if that is a valid command string
    if (parse.length > 2) {
        sendMessage(`${getRandomEmoji(false)} Invalid input provided. Run for example \`;github vasanthdeveloper/samaya\``, message.channel)
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
        .setFooter(`mantu v${appInfo.version}`)

    // determine if we got a user or a repository
    if (parse.length == 1) {
        // get the user's profile
        const user = await errorHandler((await git.getUser(parse[0])).getProfile())

        // handle if there is an API error
        if (user.e) {
            sendMessage(`${getRandomEmoji(false)} A user with username ${parse[0]} does not exist.`, message.channel)
            return false
        }

        // create a rich embed
        response.setTitle(`github.com/${user.data.data.login}`)
            .setURL(user.data.data.html_url)
            .addField('Following', user.data.data.following, true)
            .addField('Followers', user.data.data.followers, true)
            .addField('Joined on', moment(user.data.data.created_at).format('l'), true)
        
        // dynamically add sections that may be empty
        if (user.data.data.location != '') response.addField('Location', user.data.data.location, true)
        if (user.data.data.blog != '') response.addField('Web', user.data.data.blog, true)
        if (user.data.data.bio != null && user.data.data.bio != '') response.setDescription(user.data.data.bio)
        if (user.data.data.avatar_url != '') response.setThumbnail(user.data.data.avatar_url)

        // send the response
        sendMessage(response, message.channel)
    } else {
        // it's a repository
        const repo = await errorHandler((await git.getRepo(parse[0], parse[1])).getDetails())
        const ogData = await errorHandler(openGraph({ url: repo.data.data.html_url, encoding: 'UTF-8'  }))
        const repoImage: string = (ogData.data.success == true) ? ogData.data.data.ogImage.url : null

        // handle if there is an API error
        if (repo.e) {
            sendMessage(`${getRandomEmoji(false)} The repository ${parse.join('/')} could not be found.`, message.channel)
            return false
        }

        // create a rich embed
        response.setTitle(repo.data.data.full_name)
            .setURL(repo.data.data.html_url)
        
        // dynamically add the fields that may be empty
        if (repoImage.startsWith('https://avatars') == false) response.setImage(repoImage)
        if (repo.data.data.description) response.setDescription(repo.data.data.description)
        if (repo.data.data.language) response.addField('Language', repo.data.data.language, true)
        
        response.addField('Created On', moment(repo.data.data.created_at).format('l'), true)
            .addField('Branch', repo.data.data.default_branch, true)
            .addField('Author', `[${repo.data.data.owner.login}](${repo.data.data.owner.html_url})`, true)
            .addField('Size', filesize((repo.data.data.size * 1000)), true)
        
        if (repo.data.data.license) response.addField('License', repo.data.data.license.spdx_id == 'NOASSERTION' ? 'Unknown' : repo.data.data.license.spdx_id, true)

        response.addField('Links', `${(repo.data.data.homepage) ? `[Homepage](${repo.data.data.homepage}) | ` : ''}[Issues](${repo.data.data.html_url}/issues) | [Pull Requests](${repo.data.data.html_url}/pulls)${(repo.data.data.has_wiki) ? ` | [Wiki](${repo.data.data.html_url}/wiki)` : ''}`)
        
        // send the response
        sendMessage(response, message.channel)
    }
    
    return true
}