// This file will write the country in the database to respond to the user

import Discord from 'discord.js'

import database from '../database'

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
        countryInDB = await database.queries.countries.getCountryByAlpha2(countryParsed)
    } else if (countryParsed.length == 3) {
        countryInDB = await database.queries.countries.getCountryByAlpha3(countryParsed)
    } else {
        countryInDB = await database.queries.countries.getCountryByName(countryParsed.toLowerCase())
    }
    
    // check that is a valid country
    if (!countryInDB) {
        message.channel.send(`:beetle: **The country ${countryParsed} is either invalid or given in wrong format.**`)
        return false
    } else {
        // now that we know his country. Let's save it in the database
        await database.queries.members.setCountry(message.author.id, countryInDB.name)

        // tell the user that country has been updated
        message.channel.send(':gem: **Your country has been saved successfully.**')

        return true
    }
}