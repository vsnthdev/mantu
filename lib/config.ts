// This file will handle the loading and creation of the config file

import Conf from 'conf'
import moment from 'moment'

const defaultConfig: object = {
    token: '',
    lastCleanup: moment().subtract('1', 'month').format('x'),
    baseRole: 'Member',
    interval: (1000 * 60) * 60
}

export default async function loadConfig(): Promise<Conf<any>> {
    const config = new Conf({
        projectSuffix: '',
        cwd: process.cwd(),
        defaults: defaultConfig
    })

    return config
}