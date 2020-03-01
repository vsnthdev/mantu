// This file will cleanup the Discord server
// and send people a DM notifying that they have been kicked
// due to inactivity.

import { GuildMember, Role, Collection } from 'discord.js'

import discord from '../discord'
import database from '../database'
import logger from '../logger'

async function forEach(array: any[], callback): Promise<void> {
    for (let index = 0; index < array.length; index++) {
        await callback(array[index], index, array)
    }
}

async function forCollection(collection: Collection<any, any>, callback): Promise<void> {
    collection.forEach(async (value, key, map) => {
        await callback(value, key, map)
    })
}

export default function cleanUpServer(config): () => Promise<any> {
    return async function() {
        await syncDatabase(config)
        logger.info('The database has been synchronized')

        // hookup the required events
        discord.events.presenceChanged(updateActivity)
        discord.events.guildUpdated(updateUsersInDB)
    }
}


async function syncDatabase(config): Promise<void> {
    // get all members from my discord server
    const members = await discord.members.getAllMembers(config)

    // get all the users from the database
    const membersInDB = await database.queries.getAllMembers()
    let discordMembersId: string[] = []

    // loop through all the members from Discord and add new ones
    // while updating existing one's names
    await forEach(members, async (member: GuildMember) => {
        // Check if the member exists in our database
        let exists = await database.queries.memberExists(member.user.id)
        discordMembersId.push(member.user.id)
        
        if (exists == false) {
            // Add the user to our database
            logger.verbose(`Adding user: ${member.displayName} to the database`)
            database.queries.addUserToDatabase(member)
        } else {
            // update their names in case it has been changed
            await database.queries.updateDisplayName(member.user.id, member.displayName)
        }
    })

    // loop through all the members in database and delete non-existent ones
    await forEach(membersInDB, async (member) => {
        // Check if the member exists in Discord
        const exists = discordMembersId.includes(member.id)
        if (exists == false) {
            // delete the user from our database as he no longer is a member
            // on the discord server
            logger.verbose(`Removing user: ${member.name} from the database.`)
            database.queries.deleteUserFromDatabase(member.id)
        }
    })
}

async function updateActivity(oldMember: GuildMember, newMember: GuildMember): Promise<void> {
    // check if the user came online
    if (newMember.presence.status === 'offline' || newMember.presence.status == 'online') {
        // update the database accordingly!
        await database.queries.updateLastActivity(newMember.user.id)
    }
}

async function updateUsersInDB(oldMember: GuildMember, newMember: GuildMember): Promise<void> {
    // determine if the Member role was added or removed
    let roles: string[] = []
    await forCollection(newMember.roles, (role: Role) => {
        roles.push(role.name)
    })

    if (roles.includes('Member') == true) {
        await database.queries.addUserToDatabase(newMember)
    } else {
        await database.queries.deleteUserFromDatabase(newMember.user.id)
    }
}