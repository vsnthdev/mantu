// This file will handle the loading and creation of the config file

import Conf from 'conf'
import moment from 'moment'

const defaultConfig: object = {
    token: '',
    serverId: null,
    baseRole: 'Member',
    interval: (1000 * 60) * 60,
    database: {
        host: '127.0.0.1',
        port: 5432,
        user: process.env.USER,
        password: null,
        database: 'mantu'
    }
}

const config = new Conf({
    projectSuffix: '',
    cwd: process.cwd(),
    defaults: defaultConfig
})

export default function loadConfig(): Conf<any> {
    return config
}

export const databaseInformation = {
    host: config.get('database.host'),
    port: config.get('database.port'),
    user: config.get('database.user'),
    database: config.get('database.database'),
    password: config.get('database.password')
}