// This file will write the country in the database to respond to the user

import Discord from 'discord.js'

import daMembers from '../../database/members'
import daCountries from '../../database/countries'
import { sendMessage } from '../../discord/discord'

export function setTitleCase(str: string): string {
    const split = str.toLowerCase().split(' ')
    for(let i = 0; i< split.length; i++) {
        split[i] = split[i][0].toUpperCase() + split[i].slice(1)
    }

    return split.join(' ')
}

export default async function respond(command: string, message: Discord.Message): Promise<boolean> {
    // parse the country
    const countryParsed = command.substring(8)
    
    // check if the country already exists in our database
    // this is to save requests to restcountries.eu API as it is free
    let countryInDB
    
    // check if the length 2 chars or 3 chars and search accordingly
    if (countryParsed.length == 2) {
        countryInDB = await daCountries.getCountryByAlpha2(countryParsed)
    } else if (countryParsed.length == 3) {
        countryInDB = await daCountries.getCountryByAlpha3(countryParsed)
    } else {
        countryInDB = await daCountries.getCountryByName(countryParsed.toLowerCase())
    }
    
    // check that is a valid country
    if (!countryInDB) {
        sendMessage(`:beetle: **The country ${countryParsed} is either invalid or given in wrong format.**`, message.channel)
        return false
    } else {
        // now that we know his country. Let's save it in the database
        await daMembers.setCountry(message.author.id, countryInDB.name)

        // tell the user that country has been updated
        sendMessage(':gem: **Your country has been saved successfully.**', message.channel)

        return true
    }
}