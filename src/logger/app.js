/*
 *  This file will log application log events.
 *  Created On 18 September 2020
 */

import chalk from 'chalk'
import itivrutaha from 'itivrutaha'

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

console.clear()
console.log(chalk.redBright.bold(ascii))

export default await itivrutaha.createNewLogger({
    context: {
        name: 'app',
        color: chalk.redBright,
    },
})
