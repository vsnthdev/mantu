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
const cleanup_1 = require("../tasks/cleanup");
const setCountry_1 = require("./setCountry");
function respond(message, config) {
    return __awaiter(this, void 0, void 0, function* () {
        const members = Array.from(message.mentions.members.values());
        yield cleanup_1.forEach(members, (member) => __awaiter(this, void 0, void 0, function* () {
            if (!member.roles.find(r => r.name === 'Member')) {
                message.channel.send(`${member.displayName} doesn't have a "Member" role, so ${member.displayName} isn't tracked my mantu.`);
            }
            else {
                const databaseInfo = yield database_1.default.queries.members.getMember(member.user.id);
                const response = new discord_js_1.default.RichEmbed()
                    .setColor(config.get('embedColor'))
                    .setTitle(`Activity information for ${member.displayName}`)
                    .setThumbnail(member.user.avatarURL)
                    .addField('ID', member.user.id, true)
                    .addField('Last Activity', moment_1.default(databaseInfo.lastActive, 'x').fromNow(), true)
                    .addField('Timezone', (databaseInfo.timezone) ? databaseInfo.timezone : 'Unknown', true)
                    .addField('Country', (databaseInfo.country) ? setCountry_1.setTitleCase(databaseInfo.country) : 'Unknown');
                message.channel.send(response);
            }
        }));
        return true;
    });
}
exports.default = respond;
