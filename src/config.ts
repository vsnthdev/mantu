// This file will handle the loading and creation of the config file

import path from 'path'

import Conf from 'conf'

export const appInfo = require('../package.json')

export interface ConfigImpl {
    token: string;
    serverId: string;
    inviteLink: string;
    prefix: string;
    embedColor: string;
    deleteCommandAfterExecution: boolean;
    database: {
        host: string;
        port: number;
        user: string;
        password: string;
        database: string;
    };
    fixer: {
        lastFetch?: number;
        token?: string;
    };
    roles: {
        moderators: string[];
        base: string;
    };
    channels: {
        log: string;
    };
}

const defaultConfig: ConfigImpl = {
    token: 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
    serverId: '100000000000000000',
    inviteLink: 'https://vasanth.tech/discord',
    prefix: ';',
    embedColor: '0x00b0ff',
    deleteCommandAfterExecution: true,
    database: {
        host: '127.0.0.1',
        port: 5432,
        user: process.env.USER,
        password: 'password',
        database: 'mantu'
    },
    fixer: {
        lastFetch: 10000000,
        token: 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx'
    },
    roles: {
        base: '100000000000000000',
        moderators: []
    },
    channels: {
        log: '100000000000000000'
    }
}

const config = new Conf({
    projectSuffix: '',
    cwd: path.join(process.cwd(), 'data'),
    defaults: defaultConfig,
    
})

export default function loadConfig(): Conf<ConfigImpl> {
    return config
}

export const databaseInformation = {
    host: config.get('database').host,
    port: config.get('database').port,
    user: config.get('database').user,
    database: config.get('database').database,
    password: config.get('database').password
}