// This file will respond with the translated time in for the targeted member

import Discord from 'discord.js'
import moment from 'moment-timezone'

import daMembers from '../../database/members'
import { forEach } from '../../utilities/loops'
import { sendMessage, getRandomEmoji } from '../../discord/discord'

export default async function respond(command: string, message: Discord.Message): Promise<boolean> {
    // check if it is just a time command
    if (command == 'time') {
        const timezone = (await daMembers.getMember(message.author.id)).timezone
        if (timezone !== null) {
            sendMessage(`${getRandomEmoji(true)} <@${message.author.id}> the time right now is ${moment().tz(timezone).format('MMMM Do YYYY, h:mm:ss A')}.`, message.channel)
            return true
        } else {
            sendMessage(`${getRandomEmoji(false)} I don't know the timezone of ${message.member.displayName}.`, message.channel)
            return false
        }
    }

    const timeToTranslate = await moment(command.substring(5).split('<')[0], ['hh:mm a DD/MM/YYYY', 'DD/MM/YYYY'])
    
    // check if the user passed a valid time
    if (timeToTranslate.isValid() == true) {
        
        // check if there are any mentions
        const members = Array.from(message.mentions.members.values())
        await forEach(members, async (member: Discord.GuildMember) => {
            // check if member has a timezone stored in the database
            const timezone = (await daMembers.getMember(member.id)).timezone
            if (timezone !== null) {
                // do the conversion
                sendMessage(`${getRandomEmoji(true)} <@${member.id}> time for you will be ${timeToTranslate.tz(timezone).format('MMMM Do YYYY, h:mm:ss A')}.`, message.channel)
            } else {
                sendMessage(`${getRandomEmoji(false)} I don't know the timezone of ${member.displayName}.`, message.channel)
            }
        })

        return true
    } else {
        sendMessage(`${getRandomEmoji(false)} Invalid time provided. Please provide the time in formats: \`hh:mm a DD/MM/YYYY\`, \`DD/MM/YYYY\`.`, message.channel)
        return false
    }
}