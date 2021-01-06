/*
 *  This file contains default values for config file.
 *  Created On 19 September 2020
 */

export default {
    database: {
        postgres: {
            host: '127.0.0.1',
            port: 5432,
            name: 'mantu',
            username: process.env.USER,
            password: null,
        },
        redis: {
            host: '127.0.0.1',
            port: 6379,
            channel: 6,
            password: null,
        },
    },
    server: {
        host: 'localhost',
        port: 2020,
    },
    discord: {
        token: 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
        prefix: 'm ',
        server: '690044914444009508',
        tasks: {
            syncMembers: 'Member',
        },
    },
}
