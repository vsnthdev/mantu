/*
 *  This file will log application log events.
 *  Created On 18 September 2020
 */

import chalk from 'chalk'
import itivrutaha from 'itivrutaha'

import { givenArgs } from '../cli/args.js'

const initLogs = givenArgs('-h', '--help', '-v', '--version')
const printAscii = givenArgs('-q', '--quiet')

const ascii = `

                         __
.--------..---.-..-----.|  |_ .--.--.
|        ||  _  ||     ||   _||  |  |
|__|__|__||___._||__|__||____||_____|

`
    .split('\n')
    .filter(line => line != '')
    .join('\n')
    .concat('\n')

initLogs || printAscii || console.clear()
printAscii || console.log(chalk.redBright.bold(ascii))

export default await itivrutaha.createNewLogger({
    bootLog: !initLogs,
    shutdownLog: !initLogs,
    verboseIdentifier: ['-V', '--verbose'],
    context: {
        name: 'app',
        color: chalk.redBright,
    },
})
