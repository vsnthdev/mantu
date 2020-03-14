// This file will deal with the members in our database

import Discord from 'discord.js'
import moment from 'moment'

import database from './database'

// the interface skeleton for a member in database
export interface Member {
    id: string;
    name: string;
    lastActive: string;
    timezone: string;
    country: string;
}

async function getAllMembers(): Promise<any[]> {
    return await database('members')
}

// TODO: Remove this useless function!
async function memberExists(id: string): Promise<any> {
    const exists = await database('members').where({ id }).first().select()
    if (exists) {
        return true
    } else {
        return false
    }
}

async function getMember(userId: string): Promise<any> {
    return await database('members')
        .where({ id: userId })
        .first()
        .select()
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

export default {
    getMember,
    getAllMembers,
    memberExists,
    addUserToDatabase,
    deleteUserFromDatabase,
    updateDisplayName,
    updateLastActivity,
    setTimezone,
    setCountry
}