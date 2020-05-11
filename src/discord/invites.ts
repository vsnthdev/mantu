/*
 *  Creates an invite link for the configured text channel and returns it.
 *  Created On 11 May 2020
 */

import Conf from 'conf'

import { ConfigImpl } from '../config'
import channels from './channels'

async function createInvite(config: Conf<ConfigImpl>): Promise<string> {
    const channel = await channels.getWelcomeChannel(config)
    const inviteLink = await channel.createInvite({
        maxUses: 1,
        maxAge: 1800,
        unique: true,
        reason: 'Created by mantu bot.'
    })

    return `https://discord.gg/${inviteLink.code}`
}

export default {
    createInvite
}