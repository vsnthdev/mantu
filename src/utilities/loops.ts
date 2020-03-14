// This file holds some loop functions used across the project.

import Discord from 'discord.js'

export async function forEach(array: any[], callback): Promise<void> {
    for (let index = 0; index < array.length; index++) {
        await callback(array[index], index, array)
    }
}

export async function forCollection(collection: Discord.Collection<any, any>, callback): Promise<void> {
    collection.forEach(async (value, key, map) => {
        await callback(value, key, map)
    })
}