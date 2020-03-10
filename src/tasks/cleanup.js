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
const discord_1 = __importDefault(require("../discord"));
const database_1 = __importDefault(require("../database"));
const logger_1 = __importDefault(require("../logger"));
const templates_1 = __importDefault(require("../templates"));
function forEach(array, callback) {
    return __awaiter(this, void 0, void 0, function* () {
        for (let index = 0; index < array.length; index++) {
            yield callback(array[index], index, array);
        }
    });
}
exports.forEach = forEach;
function forCollection(collection, callback) {
    return __awaiter(this, void 0, void 0, function* () {
        collection.forEach((value, key, map) => __awaiter(this, void 0, void 0, function* () {
            yield callback(value, key, map);
        }));
    });
}
exports.forCollection = forCollection;
function cleanUpServer(config) {
    return function () {
        return __awaiter(this, void 0, void 0, function* () {
            yield syncDatabase(config);
            logger_1.default.info('The database has been synchronized');
            discord_1.default.events.presenceChanged(updateActivity);
            discord_1.default.events.guildUpdated(updateUsersInDB);
        });
    };
}
exports.default = cleanUpServer;
function syncDatabase(config) {
    return __awaiter(this, void 0, void 0, function* () {
        const members = yield discord_1.default.members.getAllMembers(config);
        const membersInDB = yield database_1.default.queries.members.getAllMembers();
        let discordMembersId = [];
        yield forEach(members, (member) => __awaiter(this, void 0, void 0, function* () {
            let exists = yield database_1.default.queries.members.memberExists(member.user.id);
            discordMembersId.push(member.user.id);
            if (exists == false) {
                logger_1.default.verbose(`Adding user: ${member.displayName} to the database`);
                database_1.default.queries.members.addUserToDatabase(member);
            }
            else {
                const kicked = yield kickUserIfInactive(member, membersInDB, config);
                if (kicked == false)
                    yield database_1.default.queries.members.updateDisplayName(member.user.id, member.displayName);
            }
        }));
        yield forEach(membersInDB, (member) => __awaiter(this, void 0, void 0, function* () {
            const exists = discordMembersId.includes(member.id);
            if (exists == false) {
                logger_1.default.verbose(`Removing user: ${member.name} from the database.`);
                database_1.default.queries.members.deleteUserFromDatabase(member.id);
            }
        }));
        const country = yield database_1.default.queries.countries.getCountryByName('India');
        if (!country) {
            const countryRestInfo = yield (yield node_fetch_1.default('https://restcountries.eu/rest/v2/all')).json();
            yield forEach(countryRestInfo, (country) => __awaiter(this, void 0, void 0, function* () {
                yield database_1.default.queries.countries.addCountry(country);
            }));
        }
        const lastFetch = parseInt(config.get('fixer.lastFetch'));
        const todayId = parseInt(moment_1.default().format('YYYYMMDD'));
        if (todayId > lastFetch) {
            const cashTranslationData = yield (yield node_fetch_1.default(`http://data.fixer.io/api/latest&access_key=${config.get('fixer.token')}`)).json();
            if (cashTranslationData.success == false) {
                logger_1.default.error(`Failed to connect to fixer.io api due to: "${cashTranslationData.error.info}"`, 5);
            }
            else {
                yield database_1.default.queries.cashTranslate.resetCashTranslation();
                for (let code in cashTranslationData.rates) {
                    const value = cashTranslationData.rates[code];
                    yield database_1.default.queries.cashTranslate.addCashTranslation(code, value);
                }
                config.set('fixer.lastFetch', parseInt(moment_1.default().format('YYYYMMDD')));
                logger_1.default.verbose('Finished fetching cash translation data from fixer.io');
            }
        }
    });
}
function updateActivity(oldMember, newMember) {
    return __awaiter(this, void 0, void 0, function* () {
        if (newMember.presence.status === 'offline' || newMember.presence.status == 'online') {
            yield database_1.default.queries.members.updateLastActivity(newMember.user.id);
        }
    });
}
function updateUsersInDB(oldMember, newMember) {
    return __awaiter(this, void 0, void 0, function* () {
        let roles = [];
        yield forCollection(newMember.roles, (role) => {
            roles.push(role.name);
        });
        if (roles.includes('Member') == true) {
            const exists = yield database_1.default.queries.members.memberExists(newMember.id);
            if (exists == false) {
                yield database_1.default.queries.members.addUserToDatabase(newMember);
            }
            else {
                yield database_1.default.queries.members.updateDisplayName(newMember.id, newMember.displayName);
            }
        }
        else {
            yield database_1.default.queries.members.deleteUserFromDatabase(newMember.user.id);
        }
    });
}
function kickUserIfInactive(member, members, config) {
    return __awaiter(this, void 0, void 0, function* () {
        const memberInDB = members.find((memberInDB) => memberInDB.id == member.id);
        const daysAgo = moment_1.default().diff(moment_1.default(memberInDB.lastActive, 'x'), 'days');
        if (daysAgo >= 20) {
            const template = yield templates_1.default('inactiveKick');
            let memberDMed = false;
            try {
                const channel = yield member.createDM();
                yield channel.send(template);
                memberDMed = true;
            }
            catch (e) {
                logger_1.default.warning(`Failed to send DM to ${member.displayName} before kicking.`);
            }
            yield member.kick('Inactive for 20+ days.');
            yield database_1.default.queries.members.deleteUserFromDatabase(member.id);
            yield discord_1.default.logging.sendServerLog(`:recycle: **${member.displayName} has been kicked due to inactivity for 20+ days. ${(memberDMed == false) ? 'But, couldn\'t send him the direct message.' : ''}**`, config);
        }
        return false;
    });
}
