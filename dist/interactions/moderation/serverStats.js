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
const moment_1 = __importDefault(require("moment"));
const discord_js_1 = __importDefault(require("discord.js"));
const config_1 = require("../../config");
const members_1 = __importDefault(require("../../discord/members"));
const roles_1 = __importDefault(require("../../discord/roles"));
const emojis_1 = __importDefault(require("../../discord/emojis"));
const moderators_1 = __importDefault(require("../../discord/moderators"));
const country_1 = require("../conversion/country");
const discord_1 = require("../../discord/discord");
function respond(message, config) {
    return __awaiter(this, void 0, void 0, function* () {
        const access = yield moderators_1.default.onlyModerators(message, config);
        if (access == false)
            return false;
        const totalMembers = (yield members_1.default.getAllMembers(config)).length;
        const onlineMembers = (yield members_1.default.getOnlineMembers(config)).length;
        const onlinePercent = Math.round((onlineMembers / totalMembers) * 100);
        const response = new discord_js_1.default.MessageEmbed()
            .setColor(config.get('embedColor'))
            .setTitle('Server Statistics')
            .setAuthor(message.member.displayName, message.author.displayAvatarURL({
            dynamic: true,
            format: 'webp',
            size: 256
        }))
            .addField('Online', `${onlinePercent}% (${onlineMembers})`, true)
            .addField('Region', country_1.setTitleCase(message.guild.region), true)
            .addField('Created On', moment_1.default(message.guild.createdTimestamp, 'x').format('ll'), true)
            .addField('Members', totalMembers, true)
            .addField('Moderators', (yield moderators_1.default.getAllModerators(config)).length, true)
            .addField('Roles', ((yield roles_1.default.getAllRoles()).length - 1), true)
            .addField('Emojis', (yield emojis_1.default.getAllEmojis()).length, true)
            .addField('Boosters', message.guild.premiumSubscriptionCount, true)
            .addField('Level', message.guild.premiumTier, true)
            .addField('Banned', Array.from((yield message.guild.fetchBans())).length, true)
            .setFooter(`mantu v${config_1.appInfo.version}`).setTimestamp();
        discord_1.sendMessage(response, message.channel);
        return true;
    });
}
exports.default = respond;
