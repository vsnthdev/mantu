"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const conf_1 = __importDefault(require("conf"));
const defaultConfig = {
    token: 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
    serverId: 100000000000000000,
    logChannel: 100000000000000000,
    baseRole: 'Member',
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
    }
};
const config = new conf_1.default({
    projectSuffix: '',
    cwd: path_1.default.join(process.cwd(), 'data'),
    defaults: defaultConfig
});
function loadConfig() {
    return config;
}
exports.default = loadConfig;
exports.databaseInformation = {
    host: config.get('database.host'),
    port: config.get('database.port'),
    user: config.get('database.user'),
    database: config.get('database.database'),
    password: config.get('database.password')
};
