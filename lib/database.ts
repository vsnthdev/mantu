import knex from 'knex'
import { GuildMember } from 'discord.js'
import moment from 'moment'

const knexfile = require('../knexfile')

const config = (process.env.NODE_ENV == 'production') ? knexfile['production'] : knexfile['development']

const database = knex(config)

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

const exportable = {
    config: config,
    connection: database,
    queries: {
        getAllMembers,
        memberExists,
        addUserToDatabase,
        deleteUserFromDatabase,
        updateDisplayName,
        updateLastActivity
    }
}

export default exportable