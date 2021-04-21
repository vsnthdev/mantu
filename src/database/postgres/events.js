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

const get = async id =>
    (await database('events').where({ role: id }).first().select()) ||
    (await database('events').where({ text: id }).first().select()) ||
    (await database('events').where({ stage: id }).first().select())

const purge = async id =>
    (await database('events').where({ role: id }).first().del()) ||
    (await database('events').where({ text: id }).first().del()) ||
    (await database('events').where({ stage: id }).first().del())

export default {
    get,
    add,
    purge,
}
