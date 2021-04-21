/*
 *  Deletes the created resources from Discord.
 *  Created On 21 April 2021
 */

import { discord } from '../../../discord/index.js'

export default async ({ role, group, text, stage }) => {
    role = await discord.roles.get(role)
    group = await discord.channels.get(group)
    text = await discord.channels.get(text)
    stage = await discord.channels.get(stage)

    // delete them in order!
    await text.delete()
    await stage.delete()
    await group.delete()
    await role.delete()
}
