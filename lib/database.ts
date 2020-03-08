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
        // now that we are successfully connected to the database
        // run the migrations
        await initializeTables()

        await tempDatabase('knex_migrations')
        logger.success('Finished connecting to the database')

        // save the database connection in a global variable
        database = tempDatabase
    } catch(e) {
        logger.error(`Failed to connect to the database due to: ${e.message}`, 4)
    }
}

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

async function getMember(userId: string): Promise<any> {
    return await database('members')
        .where({ id: userId })
        .first()
        .select()
}

async function initializeTables(): Promise<any> {
    try {
        await execa(path.join(process.cwd(), 'node_modules', '.bin', 'knex'), ['migrate:latest'])
        logger.success('Finished syncing database structure')
    } catch(e) {
        logger.error(e, 2)
    }
}

const exportable = {
    config: config,
    connect: connectToDatabase,
    queries: {
        initializeTables,
        getAllMembers,
        getMember,
        memberExists,
        addUserToDatabase,
        deleteUserFromDatabase,
        updateDisplayName,
        updateLastActivity,
        setTimezone
    }
}

export default exportable