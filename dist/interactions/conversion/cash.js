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
const cashify_1 = require("cashify");
const members_1 = __importDefault(require("../../database/members"));
const countries_1 = __importDefault(require("../../database/countries"));
const cashTranslate_1 = __importDefault(require("../../database/cashTranslate"));
const loops_1 = require("../../utilities/loops");
const discord_1 = require("../../discord/discord");
function respond(command, message) {
    return __awaiter(this, void 0, void 0, function* () {
        const cashToTranslate = parseFloat(command.substring(5).split('<')[0]);
        if (isNaN(cashToTranslate)) {
            discord_1.sendMessage(`${discord_1.getRandomEmoji(false)} Invalid cash amount was sent.`, message.channel);
            return false;
        }
        else {
            const fromMember = yield members_1.default.getMember(message.author.id);
            if (!fromMember.country) {
                discord_1.sendMessage(`${discord_1.getRandomEmoji(false)} You haven't told me your country. How did you think, I can do currency conversion?`, message.channel);
                return false;
            }
            const countryShortCode = (yield countries_1.default.getCountryByName(fromMember.country)).cashCode;
            const members = Array.from(message.mentions.members.values());
            yield loops_1.forEach(members, (member) => __awaiter(this, void 0, void 0, function* () {
                const toMember = yield members_1.default.getMember(member.id);
                if (!toMember) {
                    discord_1.sendMessage(`${discord_1.getRandomEmoji(false)} That user isn't a member of the server.`, message.channel);
                    return false;
                }
                if (!toMember.country) {
                    discord_1.sendMessage(`${discord_1.getRandomEmoji(false)} I don't know the country of ${member.displayName}.`, message.channel);
                    return false;
                }
                else {
                    const countryInfo = yield countries_1.default.getCountryByName(toMember.country);
                    const ratesInDB = yield cashTranslate_1.default.getRates();
                    const rates = {};
                    yield loops_1.forEach(ratesInDB, (rate) => __awaiter(this, void 0, void 0, function* () {
                        rates[rate.code] = rate.value;
                    }));
                    const cashify = new cashify_1.Cashify({
                        base: 'EUR',
                        rates: rates
                    });
                    const converted = (yield cashify.convert(cashToTranslate, { from: countryShortCode, to: countryInfo.cashCode })).toFixed(3);
                    discord_1.sendMessage(`${discord_1.getRandomEmoji(true)} <@${member.id}> for you the amount would be ${converted}${countryInfo.cashSymbol}.`, message.channel);
                }
            }));
            return true;
        }
    });
}
exports.default = respond;
