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
const node_fetch_1 = __importDefault(require("node-fetch"));
const logger_1 = __importDefault(require("../logger"));
const loops_1 = require("../utilities/loops");
const cashTranslate_1 = __importDefault(require("../database/cashTranslate"));
const countries_1 = __importDefault(require("../database/countries"));
const members_1 = __importDefault(require("../database/members"));
const members_2 = __importDefault(require("../discord/members"));
function initMembers(config) {
    return __awaiter(this, void 0, void 0, function* () {
        const discordMembers = yield members_2.default.getAllMembers(config);
        const membersInDB = yield members_1.default.getAllMembers();
        const discordMembersId = [];
        yield loops_1.forEach(discordMembers, (member) => __awaiter(this, void 0, void 0, function* () {
            const exists = yield members_1.default.memberExists(member.user.id);
            discordMembersId.push(member.user.id);
            if (exists == false) {
                logger_1.default.verbose(`Adding user: ${member.displayName} to the database`);
                yield members_1.default.addUserToDatabase(member);
            }
            else {
                yield members_1.default.updateDisplayName(member.user.id, member.displayName);
            }
        }));
        yield loops_1.forEach(membersInDB, (member) => __awaiter(this, void 0, void 0, function* () {
            const exists = discordMembersId.includes(member.id);
            if (exists == false) {
                logger_1.default.verbose(`Removing user: ${member.name} from the database.`);
                members_1.default.deleteUserFromDatabase(member.id);
            }
        }));
    });
}
function initCountries() {
    return __awaiter(this, void 0, void 0, function* () {
        const country = yield countries_1.default.getCountryByName('india');
        if (!country) {
            const countryRestInfo = yield (yield node_fetch_1.default('https://restcountries.eu/rest/v2/all')).json();
            yield loops_1.forEach(countryRestInfo, (country) => __awaiter(this, void 0, void 0, function* () {
                yield countries_1.default.addCountry(country);
            }));
        }
    });
}
function initCashTranslate(config) {
    return __awaiter(this, void 0, void 0, function* () {
        const lastFetch = config.get('fixer.lastFetch');
        const todayId = parseInt(moment_1.default().format('YYYYMMDD'));
        if (todayId > lastFetch) {
            const cashTranslationData = yield (yield node_fetch_1.default(`http://data.fixer.io/api/latest&access_key=${config.get('fixer').token}`)).json();
            if (cashTranslationData.success == false) {
                logger_1.default.error(`Failed to connect to fixer.io api due to: "${cashTranslationData.error.info}"`, 5);
            }
            else {
                yield cashTranslate_1.default.resetCashTranslation();
                for (const code in cashTranslationData.rates) {
                    const value = cashTranslationData.rates[code];
                    yield cashTranslate_1.default.addCashTranslation(code, value);
                }
                config.set('fixer.lastFetch', parseInt(moment_1.default().format('YYYYMMDD')));
                logger_1.default.verbose('Finished fetching cash translation data from fixer.io');
            }
        }
    });
}
function init(config) {
    return __awaiter(this, void 0, void 0, function* () {
        yield initMembers(config);
        yield initCountries();
        yield initCashTranslate(config);
        logger_1.default.info('The database has been synchronized');
    });
}
exports.default = init;
