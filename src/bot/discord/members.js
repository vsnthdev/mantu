/*
 *  This file interfaces with members on a Discord server.
 *  Created On 25 September 2020
 */

import roles from './roles.js'

const getAllMembers = async () => {
    const base = await roles.getRole('base')
    return Array.from(base.members.values())
}

export default {
    getAllMembers,
}
