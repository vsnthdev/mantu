/*
 *  Sends a DM, and then kicks people while also logging an event.
 *  Created On 13 April 2021
 */

import { MessageEmbed } from 'discord.js'

import { config } from '../../../config/index.js'
import { discord } from '../../discord/index.js'

const dm = async member => {
    try {
        const channel = await member.createDM()
        const { name } = await discord.guilds.getGuild()

        const desc = `
        Hey, ${member.displayName} :wave:
        You were automatically kicked from **${name}** server
        due to inactivity for 50+ days.

        Feel free to re-join the server, when you become active again.
        Here is a permanent invite link to the server :point_down:
        <${config.get('discord.invite')}>

        Hope to see you again! :sparkles:
        `
            .trim()
            .replace(/  +/g, '')

        await discord.messages.send.embed({
            channel,
            embed: new MessageEmbed()
                .setTitle('Sorry to see you go')
                .setDescription(desc),
        })

        return true
    } catch (err) {
        return false
    }
}

export default async (member, days) => {
    const dmStatus = await dm(member)
    await member.kick('Inactive for 50+ days.')

    const channel = await discord.channels.get(
        config.get('discord.channels.identifiers.logs'),
    )

    return await discord.messages.send.embed({
        channel,
        embed: new MessageEmbed()
            .setTitle('Server Cleanup')
            .addField('Period', days.toString(), true)
            .addField('Direct Message', dmStatus ? 'Sent' : 'Failed', true)
            .addField('Invite Link', config.get('discord.invite'), true)
            .setDescription(
                `<@${member.id}> has been kick due to inactivity for 50+ days.`,
            ),
    })
}
