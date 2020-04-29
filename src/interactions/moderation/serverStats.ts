// This file will output with some statistics of the Discord server

import Conf from 'conf'
import moment from 'moment'
import Discord from 'discord.js'

import { ConfigImpl, appInfo } from '../../config'
import diMembers from '../../discord/members'
import diRoles from '../../discord/roles'
import diEmojis from '../../discord/emojis'
import diModerators from '../../discord/moderators'
import { setTitleCase } from '../conversion/country'
import { sendMessage } from '../../discord/discord'

export default async function respond(message: Discord.Message, config: Conf<ConfigImpl>): Promise<boolean> {
    // check if this command was issued by a mod
    const access = await diModerators.onlyModerators(message, config)
    if (access == false) return false

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
        .addField('Online', `${onlinePercent}% (${onlineMembers})`, true)
        .addField('Region', setTitleCase(message.guild.region), true)
        .addField('Created On', moment(message.guild.createdTimestamp, 'x').format('ll'), true)
        .addField('Members', totalMembers, true)
        .addField('Moderators', (await diModerators.getAllModerators(config)).length, true)
        .addField('Roles', ((await diRoles.getAllRoles()).length - 1), true)
        .addField('Emojis', (await diEmojis.getAllEmojis()).length, true)
        .addField('Boosters', message.guild.premiumSubscriptionCount, true)
        .addField('Level', message.guild.premiumTier, true)
        .addField('Banned', Array.from((await message.guild.fetchBans())).length, true)
        .setFooter(`mantu v${appInfo.version}`).setTimestamp()

    // send the response
    sendMessage(response, message.channel)

    return true
}