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
        const environment = process.env.NODE_ENV ? process.env.NODE_ENV : 'development';
        logger_1.default.verbose(`Running in ${environment} environment`);
        client.user.setPresence({
            game: {
                name: (environment == 'production') ? 'this server.' : 'Vasanth Developer.',
                type: (environment == 'production') ? 'WATCHING' : 'LISTENING',
                url: (environment == 'production') ? 'https://vasanth.tech' : 'https://github.com/vasanthdeveloper/mantu'
            },
            status: (environment == 'production') ? 'online' : 'dnd'
        });
    });
}
function getAnyoneById(id) {
    return __awaiter(this, void 0, void 0, function* () {
        const guild = client.guilds.first();
        return guild.members.find(anyone => anyone.id == id);
    });
}
function getBaseRole(config) {
    return __awaiter(this, void 0, void 0, function* () {
        const guild = client.guilds.first();
        const baseRole = guild.roles.find(role => role.id === config.get('baseRole'));
        if (!baseRole) {
            logger_1.default.error(`A role with id ${config.get('baseRole')} does not exist.`, 6);
        }
        else {
            return baseRole;
        }
    });
}
function getAllMembers(config) {
    return __awaiter(this, void 0, void 0, function* () {
        const role = yield getBaseRole(config);
        return Array.from(role.members.values());
    });
}
function getMemberById(userId, config) {
    return __awaiter(this, void 0, void 0, function* () {
        const members = yield getAllMembers(config);
        return members.find(member => member.id == userId);
    });
}
function sendServerLog(content, config) {
    return __awaiter(this, void 0, void 0, function* () {
        const serverLog = yield client.channels.find((channel) => channel.id == config.get('logChannel'));
        serverLog.send(content);
    });
}
function sendDiscordError(e, author, channel, config) {
    return __awaiter(this, void 0, void 0, function* () {
        const content = new discord_js_1.default.RichEmbed()
            .setColor(config.get('embedColor'))
            .setTitle(`A ${e.name} occurred in mantu`)
            .addField('Name', e.name, true)
            .addField('Code', e.code, true)
            .addField('Action', e.method, true)
            .addField('Triggered By', `<@${author.id}>`, true)
            .addField('On Channel', `<#${channel.id}>`, true)
            .addField('Message', e.message);
        yield sendServerLog(content, config);
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
    getAnyoneById,
    members: {
        getAllMembers,
        getMemberById
    },
    logging: {
        sendServerLog,
        sendDiscordError
    },
    roles: {
        getBaseRole
    },
    events: {
        presenceChanged,
        guildUpdated,
        commandReceived
    },
};
