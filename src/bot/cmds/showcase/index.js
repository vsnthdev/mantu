/*
 *  Sub-commands related to showcasing.
 *  Created On 07 May 2021
 */

import dirname from 'es-dirname'

import { subCmds } from '../events/index.js'

export default {
    description: 'Commands related to showcasing different things',
    options: await subCmds(dirname(), []),
}
