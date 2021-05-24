/*
 *  Send an initial message with the invite code.
 *  Created On 07 May 2021
 */

import { config } from '~config'
import { discord } from '~discord'

export default async (desc, { code }) => {
    const channel = await discord.channels.get(
        config.get('discord.channels.identifiers.showcase.server'),
    )

    await channel.send(desc.concat('\n\n').concat(`https://discord.gg/${code}`))
}
