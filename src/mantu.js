"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = __importDefault(require("discord.js"));
const config = require('../config.json');
const client = new discord_js_1.default.Client();
client.once('ready', () => {
    console.log('ready!');
});
client.login(config.token);
client.on('message', (message) => {
    if (message.content.startsWith(config.prefix) == true) {
        const command = message.content.replace(config.prefix, '');
        console.log(command);
    }
});
