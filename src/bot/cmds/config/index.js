/*
 *  Updates store files during runtime.
 *  Created On 26 May 2021
 */

import restrict from './restrict.js'

const namespaces = ['restrict']

const action = async (inter, { operation, key, value }) => {
    if (operation == 'set') await restrict.set({ inter, key, value })
    if (operation == 'unset') await restrict.unset({ inter, key, value })
}

export default {
    action,
    description: 'Updates store files during runtime.',
    restrict: ['user:492205153198407682'],
    options: [
        {
            type: 3,
            required: true,
            name: 'operation',
            description: 'Operation to perform',
            choices: ['set', 'unset'].map(name => {
                return { name, value: name }
            }),
        },
        {
            type: 3,
            required: true,
            name: 'key',
            description: 'Key to modify',
        },
        {
            type: 3,
            required: true,
            name: 'value',
            description: 'Value to modify to for the given key',
        },
        {
            type: 3,
            name: 'namespace',
            description: 'The namespace to work on.',
            choices: namespaces.map(name => {
                return { name, value: name }
            }),
        },
    ],
}
