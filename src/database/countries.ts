// This file will deal with everything in the countries table in the database

import database from './database'

// the interface skeleton for a country in database
export interface Country {
    name: string;
    nativeName: string;
    alpha2code: string;
    alpha3code: string;
    cashCode: string;
    cashSymbol: string;
}

async function getCountryByName(name: string): Promise<any> {
    return await database('countries')
        .where({ name: name })
        .first()
        .select()
}

async function getCountryByAlpha2(code: string): Promise<any> {
    return await database('countries')
        .where({ alpha2code: code })
        .first()
        .select()
}

async function getCountryByAlpha3(code: string): Promise<any> {
    return await database('countries')
        .where({ alpha3code: code })
        .first()
        .select()
}

async function addCountry(country): Promise<void> {
    return await database('countries')
        .insert({
            name: `${country.name}`.toLowerCase(),
            nativeName: country.nativeName,
            alpha2code: country.alpha2Code,
            alpha3code: country.alpha3Code,
            cashCode: country.currencies[0].code,
            cashSymbol: country.currencies[0].symbol
        })
}

export default {
    getCountryByName,
    getCountryByAlpha2,
    getCountryByAlpha3,
    addCountry
}