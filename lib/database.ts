import knex from 'knex'
import { GuildMember } from 'discord.js'
import moment from 'moment'
import logger from './logger'

const knexfile = require('../knexfile')

const config = (process.env.NODE_ENV == 'production') ? knexfile['production'] : knexfile['development']

// the variable that stores the database connection
// which can used across this file
let database

function connectToDatabase(): Promise<void> {
    return new Promise((resolve) => {
        const tempDatabase = knex(config)

        // check if we have a successful connection by testing a query
        tempDatabase('knex_migrations')
            .catch((err) => {
                logger.error(`Failed to connect to the database due to: ${err.message}`, 4)
            })
            .then(() => {
                database = tempDatabase
                logger.success('Finished connecting to the database')
                resolve()
            })
    })
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

const exportable = {
    config: config,
    connect: connectToDatabase,
    queries: {
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