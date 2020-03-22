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
const discord_1 = require("../../discord/discord");
function respond(command, message) {
    return __awaiter(this, void 0, void 0, function* () {
        const timezoneParsed = moment_timezone_1.default.tz.zone(command.substring(9));
        if (timezoneParsed !== null) {
            yield members_1.default.setTimezone(message.author.id, timezoneParsed.name);
            discord_1.sendMessage(':gem: **Your timezone has been saved successfully.**', message.channel);
            return true;
        }
        else {
            discord_1.sendMessage(':beetle: **Invalid timezone provided. Please issue the command once again with timezone in the following format:** `Continent/Place`', message.channel);
            return false;
        }
    });
}
exports.default = respond;
