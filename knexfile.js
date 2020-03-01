const cli = require('./src/config').databaseInformation

const exportable = {
    development: {
        client: 'pg',
        connection: {
            host: cli.host,
            port: cli.port,
            user: cli.user,
            database: `${cli.database}_dev`,
            password: cli.password
        }
    },
    production: {
        client: 'pg',
        connection: {
            host: cli.host,
            port: cli.port,
            user: cli.user,
            database: cli.database,
            password: cli.password
        }
    }
}

module.exports = exportable