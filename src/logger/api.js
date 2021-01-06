/*
 *  This file will log discord log events.
 *  Created On 18 September 2020
 */

import chalk from 'chalk'
import itivrutaha from 'itivrutaha'

export default itivrutaha.createNewLogger({
    theme: `🌏 ${chalk.blueBright('API')} [${chalk.gray(
        ':time',
    )}] :type :message`,
    timeFormat: 'hh:MM:ss TT, dS mmm yyyy',
    boldType: true,
    typeCase: 0,
})
