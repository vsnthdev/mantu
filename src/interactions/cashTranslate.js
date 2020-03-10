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
const database_1 = __importDefault(require("../database"));
const cleanup_1 = require("../tasks/cleanup");
function respond(command, message) {
    return __awaiter(this, void 0, void 0, function* () {
        const cashToTranslate = parseFloat(command.substring(5).split('<')[0]);
        if (isNaN(cashToTranslate)) {
            message.channel.send(':beetle: **Invalid cash amount was sent.**');
            return false;
        }
        else {
            const memberCountry = (yield database_1.default.queries.members.getMember(message.author.id)).country;
            if (memberCountry == null) {
                message.channel.send(':face_with_raised_eyebrow: **You haven\'t told me your country. How did you think, I can do currency conversion? Issue the command** `;country [the country you live in]` **without brackets first.**');
                return false;
            }
            const countryShortCode = (yield database_1.default.queries.countries.getCountryByName(memberCountry)).cashCode;
            const members = Array.from(message.mentions.members.values());
            yield cleanup_1.forEach(members, (member) => __awaiter(this, void 0, void 0, function* () {
                const memberCountry = (yield database_1.default.queries.members.getMember(member.id)).country;
                if (memberCountry == null) {
                    message.channel.send(`:man_shrugging: **I don't know the country of ${member.displayName}.**`);
                    return false;
                }
                else {
                    const countryInfo = yield database_1.default.queries.countries.getCountryByName(memberCountry);
                    const ratesInDB = yield database_1.default.queries.cashTranslate.getRates();
                    let rates = {};
                    yield cleanup_1.forEach(ratesInDB, (rate) => __awaiter(this, void 0, void 0, function* () {
                        rates[rate.code] = rate.value;
                    }));
                    const cashify = new cashify_1.Cashify({
                        base: 'EUR',
                        rates: rates
                    });
                    const converted = (yield cashify.convert(cashToTranslate, { from: countryShortCode, to: countryInfo.cashCode })).toFixed(3);
                    message.channel.send(`:moneybag: <@${member.id}> **for you the amount would be ${converted}${countryInfo.cashSymbol}.**`);
                }
            }));
            return true;
        }
    });
}
exports.default = respond;
