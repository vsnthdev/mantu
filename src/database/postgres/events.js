/*
 *  Functions to manage events table.
 *  Created On 21 April 2021
 */

import { database } from './index.js'

const add = async ({ name, role, group, text, stage, starts, host }) =>
    await database('events').insert({
        name,
        starts,
        host,
        role: role.id,
        group: group.id,
        text: text.id,
        stage: stage.id,
        notified: 0,
    })

const list = async () => await database('events')

const get = async id =>
    (await database('events').where({ role: id }).first().select()) ||
    (await database('events').where({ text: id }).first().select()) ||
    (await database('events').where({ stage: id }).first().select())

const notified = async data =>
    await database('events')
        .where({
            role: data.role,
        })
        .first()
        .select()
        .update({
            notified: data.notified + 1,
        })

const purge = async id =>
    (await database('events').where({ role: id }).first().del()) ||
    (await database('events').where({ text: id }).first().del()) ||
    (await database('events').where({ stage: id }).first().del())

export default {
    add,
    list,
    get,
    notified,
    purge,
}
