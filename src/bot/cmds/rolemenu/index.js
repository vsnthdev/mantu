/*
 *  Commands to manage role menu message.
 *  Created On 13 May 2021
 */

import dirname from 'es-dirname'

import { subCmds } from '../events/index.js'

export default {
    description: 'Manage the role menu message on this server.',
    options: await subCmds(dirname(), []),
}
