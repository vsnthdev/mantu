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
const moment_timezone_1 = __importDefault(require("moment-timezone"));
const members_1 = __importDefault(require("../../database/members"));
const loops_1 = require("../../utilities/loops");
const discord_1 = require("../../discord/discord");
function respond(command, message) {
    return __awaiter(this, void 0, void 0, function* () {
        if (command == 'time') {
            const timezone = (yield members_1.default.getMember(message.author.id)).timezone;
            if (timezone !== null) {
                discord_1.sendMessage(`${discord_1.getRandomEmoji(true)} <@${message.author.id}> the time right now is ${moment_timezone_1.default().tz(timezone).format('MMMM Do YYYY, h:mm:ss A')}.`, message.channel);
                return true;
            }
            else {
                discord_1.sendMessage(`${discord_1.getRandomEmoji(false)} I don't know the timezone of ${message.member.displayName}.`, message.channel);
                return false;
            }
        }
        const timeToTranslate = yield moment_timezone_1.default(command.substring(5).split('<')[0], ['hh:mm a DD/MM/YYYY', 'DD/MM/YYYY']);
        if (timeToTranslate.isValid() == true) {
            const members = Array.from(message.mentions.members.values());
            yield loops_1.forEach(members, (member) => __awaiter(this, void 0, void 0, function* () {
                const timezone = (yield members_1.default.getMember(member.id)).timezone;
                if (timezone !== null) {
                    discord_1.sendMessage(`${discord_1.getRandomEmoji(true)} <@${member.id}> time for you will be ${timeToTranslate.tz(timezone).format('MMMM Do YYYY, h:mm:ss A')}.`, message.channel);
                }
                else {
                    discord_1.sendMessage(`${discord_1.getRandomEmoji(false)} I don't know the timezone of ${member.displayName}.`, message.channel);
                }
            }));
            return true;
        }
        else {
            discord_1.sendMessage(`${discord_1.getRandomEmoji(false)} Invalid time provided. Please provide the time in formats: \`hh:mm a DD/MM/YYYY\`, \`DD/MM/YYYY\`.`, message.channel);
            return false;
        }
    });
}
exports.default = respond;
