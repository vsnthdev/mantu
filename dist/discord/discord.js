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
exports.setStatus = setStatus;
exports.default = client;
