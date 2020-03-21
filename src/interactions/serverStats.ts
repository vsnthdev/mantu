// This file will output with some statistics of the Discord server

import Conf from 'conf'
import moment from 'moment'
import Discord from 'discord.js'

import { ConfigImpl, appInfo } from '../config'
import { onlyModerators } from './userActivityInfo'
import diMembers from '../discord/members'
import diRoles from '../discord/roles'
import diEmojis from '../discord/emojis'
import diModerators from '../discord/moderators'
import { setTitleCase } from './setCountry'

export default async function respond(message: Discord.Message, config: Conf<ConfigImpl>): Promise<boolean> {
    // check if this command was issued by a mod
    const access = await onlyModerators(message, config)
    if (access == false) {
        message.channel.send(':beetle: **You don\'t have access to this command.** :person_shrugging:')
        return false
    }

    // prepares the values we need
    const totalMembers = (await diMembers.getAllMembers(config)).length
    const onlineMembers = (await diMembers.getOnlineMembers(config)).length
    const onlinePercent = Math.round((onlineMembers / totalMembers) * 100)

    // prepare the response
    const response = new Discord.MessageEmbed()
        .setColor(config.get('embedColor'))
        .setTitle('Server Statistics')
        .setAuthor(message.member.displayName, message.author.displayAvatarURL({
            dynamic: true,
            format: 'webp',
            size: 256
        }))
        .addField('Server ID', config.get('serverId'), false)
        .addField('Members', totalMembers, true)
        .addField('Online', `${onlinePercent}% (${onlineMembers})`, true)
        .addField('Moderators', (await diModerators.getAllModerators(config)).length, true)
        .addField('Region', setTitleCase(message.guild.region), true)
        .addField('Roles', ((await diRoles.getAllRoles()).length - 1), true)
        .addField('Emojis', (await diEmojis.getAllEmojis()).length, true)
        .addField('Created On', moment(message.guild.createdTimestamp, 'x').format('ll'), true)
        .addField('Boosters', message.guild.premiumSubscriptionCount, true)
        .addField('Level', message.guild.premiumTier, true)
        .addField('Invite Link', config.get('inviteLink'), false)
        .setFooter(`mantu v${appInfo.version}`).setTimestamp()

    // send the response
    message.channel.send('', {
        embed: response
    })

    return true
}