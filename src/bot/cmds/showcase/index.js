/*
 *  Sub-commands related to showcasing.
 *  Created On 07 May 2021
 */

import dirname from 'es-dirname'

import { subCmds } from '../events/index.js'

export default {
    description: 'Showcasing different things on this server.',
    options: await subCmds(dirname(), []),
}
