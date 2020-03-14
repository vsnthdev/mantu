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
const members_1 = __importDefault(require("../database/members"));
const loops_1 = require("../utilities/loops");
function respond(command, message) {
    return __awaiter(this, void 0, void 0, function* () {
        if (command == 'time') {
            const timezone = (yield members_1.default.getMember(message.author.id)).timezone;
            if (timezone !== null) {
                message.channel.send(`:clock5: <@${message.author.id}> **the time right now is ${moment_timezone_1.default().tz(timezone).format('MMMM Do YYYY, h:mm:ss A')}.**`);
                return true;
            }
            else {
                message.channel.send(`:man_shrugging: **I don't know the timezone of ${message.member.displayName}.**`);
                return false;
            }
        }
        const timeToTranslate = yield moment_timezone_1.default(command.substring(5).split('<')[0], ['hh:mm a DD/MM/YYYY', 'DD/MM/YYYY']);
        if (timeToTranslate.isValid() == true) {
            const members = Array.from(message.mentions.members.values());
            yield loops_1.forEach(members, (member) => __awaiter(this, void 0, void 0, function* () {
                const timezone = (yield members_1.default.getMember(member.id)).timezone;
                if (timezone !== null) {
                    message.channel.send(`:clock5: <@${member.id}> **time for you will be ${timeToTranslate.tz(timezone).format('MMMM Do YYYY, h:mm:ss A')}.**`);
                }
                else {
                    message.channel.send(`:man_shrugging: **I don't know the timezone of ${member.displayName}.**`);
                }
            }));
            return true;
        }
        else {
            message.channel.send(':beetle: **Invalid time provided. Please provide the time in formats:** `hh:mm a DD/MM/YYYY`, `DD/MM/YYYY`**.**');
            return false;
        }
    });
}
exports.default = respond;
