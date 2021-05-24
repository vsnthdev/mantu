/*
 *  Deletes the created resources from Discord.
 *  Created On 21 April 2021
 */

import { discord } from '~discord'

export default async ({ role, group, text, stage }) => {
    role = await discord.roles.get(role)
    group = await discord.channels.get(group)
    text = await discord.channels.get(text)
    stage = await discord.channels.get(stage)

    // delete them in order!
    if (text) text = await text.delete()
    if (stage) stage = await stage.delete()
    if (group) group = await group.delete()
    if (role) role = await role.delete()

    return {
        text: text ? text.deleted : false,
        stage: stage ? stage.deleted : false,
        group: group ? group.deleted : false,
        role: role ? role.deleted : false,
    }
}
