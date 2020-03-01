"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const conf_1 = __importDefault(require("conf"));
const defaultConfig = {
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
};
const config = new conf_1.default({
    projectSuffix: '',
    cwd: process.cwd(),
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
