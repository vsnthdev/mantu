// This file will deal with all the moderators

import Discord from 'discord.js'
import Conf from 'conf'

import { ConfigImpl } from '../config'
import { forEach } from '../utilities/loops'
import diRoles from './roles'
import { sendMessage, getRandomEmoji  } from './discord'

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

// onlyModerators() will ensures only mods can access the commands
export async function onlyModerators(message: Discord.Message, config: Conf<ConfigImpl>): Promise<boolean> {
    const mods = config.get('roles').moderators
    let giveAccess = false
    
    // loop through all the mod roles
    await forEach(mods, async (roleId: string) => {
        const roleExists = message.member.roles.cache.find(role => role.id == roleId)
        if (roleExists) {
            giveAccess = true
        }
    })

    // tell the user the access has been denied
    if (giveAccess == false) sendMessage(`${getRandomEmoji(false)} You don't have access to this command.`, message.channel)

    // return the giveAccess variable
    return giveAccess
}

export default {
    getAllModerators,
    onlyModerators
}