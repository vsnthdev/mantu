// This file will write the timezone in the database and respond to the user

import Discord from 'discord.js'
import moment from 'moment-timezone'

import daMembers from '../../database/members'
import { sendMessage } from '../../discord/discord'

export default async function respond(command: string, message: Discord.Message): Promise<boolean> {
    // parse the timezone string
    const timezoneParsed = moment.tz.zone(command.substring(9))
    
    // check if the timezone is valid, otherwise tell the user about it
    if (timezoneParsed !== null) {
        // update in the database
        await daMembers.setTimezone(message.author.id, timezoneParsed.name)

        // tell the user that the timezone was saved
        sendMessage(':gem: **Your timezone has been saved successfully.**', message.channel)

        return true
    } else {
        // tell the user the timezone is wrong!
        sendMessage(':beetle: **Invalid timezone provided. Please issue the command once again with timezone in the following format:** `Continent/Place`', message.channel)

        return false
    }
}