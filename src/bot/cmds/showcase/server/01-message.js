/*
 *  Send an initial message with the invite code.
 *  Created On 07 May 2021
 */

import { config } from '../../../../config/index.js'
import { discord } from '../../../discord/index.js'

export default async (desc, { code }) => {
    const channel = await discord.channels.get(
        config.get('discord.showcase.server'),
    )

    await channel.send(desc.concat('\n\n').concat(`https://discord.gg/${code}`))
}
