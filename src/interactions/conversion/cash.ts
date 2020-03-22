// This file will convert currencies by read the target user's preference

import Discord from 'discord.js'
import { Cashify } from 'cashify'

import daMembers from '../../database/members'
import daCountries from '../../database/countries'
import daCashTranslate from '../../database/cashTranslate'
import { forEach } from '../../utilities/loops'
import { sendMessage, getRandomEmoji } from '../../discord/discord'

export default async function respond(command: string, message: Discord.Message): Promise<boolean> {
    const cashToTranslate = parseFloat(command.substring(5).split('<')[0])
    
    // check if the cash is a valid integer
    if (isNaN(cashToTranslate)) {
        // tell the user that the number was invalid
        sendMessage(`${getRandomEmoji(false)} Invalid cash amount was sent.`, message.channel)
        return false
    } else {
        // now that we know there is an actual number in the command
        // get the country and countryCode for the message author
        const memberCountry = (await daMembers.getMember(message.author.id)).country

        // check if we know the country of the author
        if (memberCountry == null) {
            sendMessage(`${getRandomEmoji(false)} You haven't told me your country. How did you think, I can do currency conversion?`, message.channel)
            return false
        }

        const countryShortCode = (await daCountries.getCountryByName(memberCountry)).cashCode
        
        // check if there are any mentions
        const members = Array.from(message.mentions.members.values())
        await forEach(members, async (member: Discord.GuildMember) => {
            // check if the member has a country in his database
            const memberCountry = (await daMembers.getMember(member.id)).country
            
            if (memberCountry == null) {
                sendMessage(`${getRandomEmoji(false)} I don't know the country of ${member.displayName}.`, message.channel)
                return false
            } else {
                // get the country's short code
                const countryInfo = await daCountries.getCountryByName(memberCountry)

                // get conversion rates from our database
                const ratesInDB = await daCashTranslate.getRates()
                const rates = {}
                await forEach(ratesInDB, async (rate) => {
                    rates[rate.code] = rate.value
                })
                
                // initialize the cashify conversion library
                const cashify = new Cashify({
                    base: 'EUR',
                    rates: rates
                })

                // do the conversion
                const converted = (await cashify.convert(cashToTranslate, { from: countryShortCode, to: countryInfo.cashCode })).toFixed(3)
                
                // reply to the user
                sendMessage(`${getRandomEmoji(true)} <@${member.id}>*for you the amount would be ${converted}${countryInfo.cashSymbol}.`, message.channel)
            }
        })

        return true
    }
}