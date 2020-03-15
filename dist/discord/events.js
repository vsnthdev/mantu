"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_1 = __importDefault(require("./discord"));
function presenceChanged(callback) {
    discord_1.default.on('presenceUpdate', (oldMember, newMember) => {
        callback(oldMember, newMember);
    });
}
function guildMemberUpdate(callback) {
    discord_1.default.on('guildMemberUpdate', (oldMember, newMember) => {
        callback(oldMember, newMember);
    });
}
function commandReceived(config, callback) {
    discord_1.default.on('message', (message) => {
        if (message.content.startsWith(config.get('prefix'))) {
            callback(message.content.substring(1), message);
        }
    });
}
exports.default = {
    presenceChanged,
    guildMemberUpdate,
    commandReceived
};
