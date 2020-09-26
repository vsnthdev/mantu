/*
 *  This file deals with the members table in the database.
 *  Created On 25 September 2020
 */

import { database } from './index.js'

const getAll = async () => await database('members')
const getMemberByID = async id =>
    await database('members').where({ id }).first().select()
const add = async member =>
    await database('members').insert({
        id: member.user.id,
        identifier: `${member.user.username}#${member.user.discriminator}`,
    })
const updateId = async member =>
    await database('members')
        .where({ id: member.user.id })
        .update({
            identifier: `${member.user.username}#${member.user.discriminator}`,
        })
const del = async id => await database('members').where({ id }).delete()

export default {
    getAll,
    add,
    del,
    updateId,
    getMemberBy: {
        Id: getMemberByID,
    },
}
