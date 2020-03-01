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
const moment_1 = __importDefault(require("moment"));
const database_1 = __importDefault(require("../database"));
function respond(message) {
    return __awaiter(this, void 0, void 0, function* () {
        const targetUser = Array.from(message.mentions.members.values())[1];
        const myself = message.mentions.members.first();
        const databaseInfo = yield database_1.default.queries.getMember(targetUser.user.id);
        const response = new discord_js_1.default.RichEmbed()
            .setColor('0x006cff')
            .setTitle(`Activity information for ${targetUser.displayName}`)
            .setThumbnail(targetUser.user.avatarURL)
            .setAuthor(myself.displayName, myself.user.avatarURL)
            .addField('ID', targetUser.user.id)
            .addField('Last Activity', moment_1.default(databaseInfo.lastActive, 'x').fromNow());
        message.channel.send(response);
    });
}
exports.default = respond;
