import path from 'path'

import knex from 'knex'
import Discord from 'discord.js'
import moment from 'moment'
import execa from 'execa'

import logger from './logger'

const knexfile = require('../knexfile')

const config = (process.env.NODE_ENV == 'production') ? knexfile['production'] : knexfile['development']

// the variable that stores the database connection
// which can used across this file
let database

async function connectToDatabase(): Promise<void> {
    const tempDatabase = await knex(config)

    // check if we have a successful connection by testing a query
    try {
        await tempDatabase('knex_migrations')
        logger.success('Finished connecting to the database')

        // now that we are successfully connected to the database
        // run the migrations
        await initializeTables()

        // save the database connection in a global variable
        database = tempDatabase
    } catch(e) {
        logger.error(`Failed to connect to the database due to: ${e.message}`, 4)
    }
}

async function initializeTables(): Promise<any> {
    try {
        await execa(path.join(process.cwd(), 'node_modules', '.bin', 'knex'), ['migrate:latest'])
        logger.success('Finished syncing database structure')
    } catch(e) {
        logger.error(e, 2)
    }
}

//#region MEMBERS
async function getAllMembers(): Promise<any[]> {
    return await database('members')
}

async function memberExists(id: string): Promise<any> {
    const exists = await database('members').where({ id }).first().select()
    if (exists) {
        return true
    } else {
        return false
    }
}

async function addUserToDatabase(member: Discord.GuildMember): Promise<void> {
    return await database('members')
        .insert({
            id: member.user.id,
            name: member.displayName,
            lastActive: moment().format('x')
        })
}

async function deleteUserFromDatabase(userId: string): Promise<any> {
    return await database('members')
        .where({id: userId})
        .delete()
}

async function updateDisplayName(userId: string, newDisplayName: string): Promise<void> {
    return await database('members')
        .where({ id: userId })
        .update({
            name: newDisplayName
        })
}

async function updateLastActivity(userId: string): Promise<void> {
    return await database('members')
        .where({ id: userId })
        .update({
            lastActive: moment().format('x')
        })
}

async function setTimezone(userId: string, timezone: string): Promise<void> {
    await database('members')
        .where({ id: userId })
        .update({
            timezone
        })
}

async function setCountry(userId: string, country: string): Promise<void> {
    await database('members')
        .where({ id: userId })
        .update({
            country
        })
}

async function getMember(userId: string): Promise<any> {
    return await database('members')
        .where({ id: userId })
        .first()
        .select()
}

//#endregion

//#region COUNTRIES

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

//#endregion

//#region CASHTRANSLATE

async function addCashTranslation(code, value): Promise<void> {
    return await database('cashTranslate')
        .insert({ code, value })
}

async function resetCashTranslation(): Promise<void> {
    await database('cashTranslate')
        .del()
}

async function getRates(): Promise<any> {
    return await database('cashTranslate')
}

//#endregion

const exportable = {
    config: config,
    connect: connectToDatabase,
    queries: {
        initializeTables,
        members: {
            getAllMembers,
            getMember,
            memberExists,
            addUserToDatabase,
            deleteUserFromDatabase,
            updateDisplayName,
            updateLastActivity,
            setTimezone,
            setCountry
        },
        countries: {
            getCountryByName,
            getCountryByAlpha2,
            getCountryByAlpha3,
            addCountry
        },
        cashTranslate: {
            addCashTranslation,
            resetCashTranslation,
            getRates
        }
    }
}

export default exportable