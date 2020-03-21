// This file will deal with all the moderators

import Discord from 'discord.js'
import Conf from 'conf'

import { ConfigImpl } from '../config'
import { forEach } from '../utilities/loops'
import diRoles from './roles'

async function getAllModerators(config: Conf<ConfigImpl>): Promise<Discord.GuildMember[]> {
    const moderatorRoles = await diRoles.getModeratorRoles(config)
    const moderators: Array<Discord.GuildMember> = []
    
    // loop through all the moderator roles
    await forEach(moderatorRoles, async (moderatorRole: Discord.Role) => {
        const moderatorsInRole = Array.from(moderatorRole.members.values())

        // loop through we member we get from the moderator role
        await forEach(moderatorsInRole, async (moderator: Discord.GuildMember) => {
            // only add if this particular member does not already exist in our returnable
            const exists = moderators.find(mod => mod.id == moderator.id)
            if (!exists) {
                // add him/her to our list
                moderators.push(moderator)
            }
        })
    })

    return moderators
}

export default {
    getAllModerators
}