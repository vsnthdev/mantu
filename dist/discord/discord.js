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
const logger_1 = __importDefault(require("../logger"));
const time_1 = require("../utilities/time");
const emojis_1 = __importDefault(require("./emojis"));
const loops_1 = require("../utilities/loops");
const client = new discord_js_1.default.Client();
function authenticate(token, callback) {
    return __awaiter(this, void 0, void 0, function* () {
        client.on('ready', callback);
        client.login(token)
            .catch(err => logger_1.default.error(err, 2));
        return;
    });
}
exports.authenticate = authenticate;
function setStatus() {
    return __awaiter(this, void 0, void 0, function* () {
        const environment = process.env.NODE_ENV ? process.env.NODE_ENV : 'development';
        logger_1.default.verbose(`Running in ${environment} environment`);
        const presences = [
            [3, 'this server.'],
            [3, 'for a command.'],
            [0, 'with cupcakes.']
        ];
        time_1.setInterval(30000, () => __awaiter(this, void 0, void 0, function* () {
            const presence = presences[Math.floor(Math.random() * presences.length)];
            client.user.setPresence({
                status: (environment == 'production') ? 'online' : 'dnd',
                activity: {
                    name: presence[1],
                    type: presence[0],
                    url: (environment == 'production') ? 'https://vasanth.tech' : 'https://github.com/vasanthdeveloper/mantu'
                },
            });
        }));
        client.user.setPresence({
            activity: {
                name: 'this server.',
                type: 'WATCHING',
                url: (environment == 'production') ? 'https://vasanth.tech' : 'https://github.com/vasanthdeveloper/mantu'
            },
            status: (environment == 'production') ? 'online' : 'dnd'
        });
    });
}
exports.setStatus = setStatus;
function logout() {
    logger_1.default.info('Logged out from Discord');
    client.destroy();
}
exports.logout = logout;
function sendMessage(content, channel) {
    return __awaiter(this, void 0, void 0, function* () {
        const textChannel = channel;
        if (typeof content == 'string') {
            const emojiRendered = yield emojis_1.default.renderString(content);
            return yield textChannel.send(emojiRendered);
        }
        else {
            if (content.description)
                content.setDescription(yield emojis_1.default.renderString(content.description));
            if (content.title)
                content.setTitle(yield emojis_1.default.renderString(content.title));
            yield loops_1.forEach(content.fields, (field) => __awaiter(this, void 0, void 0, function* () {
                content.fields.find(field2 => field2.name == field.name).value = yield emojis_1.default.renderString(field.value);
            }));
            return yield textChannel.send('', {
                embed: content
            });
        }
    });
}
exports.sendMessage = sendMessage;
exports.default = client;
