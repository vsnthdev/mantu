import path from 'path'

import knex from 'knex'
import { GuildMember } from 'discord.js'
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
        database = tempDatabase
        logger.success('Finished connecting to the database')
    } catch(e) {
        // if the table isn't found, initialize the database to create those tables
        if (e.code == '42P01') {
            await initializeTables()
            await connectToDatabase()
        } else {
            logger.error(`Failed to connect to the database due to: ${e.message}`, 4)
        }
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

async function addUserToDatabase(member: GuildMember): Promise<void> {
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

async function getMember(userId: string): Promise<any> {
    return await database('members')
        .where({ id: userId })
        .first()
        .select()
}

async function initializeTables(): Promise<any> {
    try {
        await execa(path.join(process.cwd(), 'node_modules', '.bin', 'knex'), ['migrate:latest'])
        logger.success('Finished initializing the database')
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
        updateLastActivity
    }
}

export default exportable