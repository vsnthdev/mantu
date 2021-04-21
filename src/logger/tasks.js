/*
 *  This file will log application log events.
 *  Created On 18 September 2020
 */

import chalk from 'chalk'
import itivrutaha from 'itivrutaha'

export default await itivrutaha.createNewLogger({
    bootLog: false,
    shutdownLog: false,
    context: {
        name: 'tas',
        color: chalk.blueBright,
    },
})
