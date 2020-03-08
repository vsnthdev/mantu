"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = __importDefault(require("discord.js"));
const logger_1 = __importDefault(require("./logger"));
const client = new discord_js_1.default.Client();
function authenticate(token, callback) {
    return __awaiter(this, void 0, void 0, function* () {
        client.on('ready', callback);
        client.login(token)
            .catch(err => logger_1.default.error(err, 2));
        return;
    });
}
function setStatus() {
    return __awaiter(this, void 0, void 0, function* () {
        client.user.setPresence({
            game: {
                name: 'this server.',
                type: 'WATCHING',
                url: 'https://vasanth.tech'
            },
            status: 'online'
        });
    });
}
function getAllMembers(config) {
    return __awaiter(this, void 0, void 0, function* () {
        const returnable = [];
        const guild = client.guilds.first();
        const role = guild.roles.find(role => role.name === config.get('baseRole'));
        role.members.forEach(member => {
            returnable.push(member);
        });
        return returnable;
    });
}
function presenceChanged(callback) {
    client.on('presenceUpdate', (oldMember, newMember) => {
        callback(oldMember, newMember);
    });
}
function guildUpdated(callback) {
    client.on('guildMemberUpdate', (oldMember, newMember) => {
        callback(oldMember, newMember);
    });
}
function commandReceived(config, callback) {
    client.on('message', (message) => {
        if (message.content.startsWith(config.get('prefix'))) {
            callback(message.content.substring(1), message);
        }
    });
}
exports.default = {
    authenticate,
    setStatus,
    members: {
        getAllMembers
    },
    events: {
        presenceChanged,
        guildUpdated,
        commandReceived
    }
};
