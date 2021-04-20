/*
 *  Functions to manage events table.
 *  Created On 21 April 2021
 */

import { database } from './index.js'

const add = async ({ name, role, group, text, stage }) =>
    await database('events').insert({
        name,
        role: role.id,
        group: group.id,
        text: text.id,
        stage: stage.id,
    })

export default {
    add,
}
