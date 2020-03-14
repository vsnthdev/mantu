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
const discord_1 = __importDefault(require("./discord"));
function sendServerLog(content, config) {
    return __awaiter(this, void 0, void 0, function* () {
        const serverLog = yield discord_1.default.channels.find((channel) => channel.id == config.get('channels').log);
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
exports.default = {
    sendServerLog,
    sendDiscordError
};
