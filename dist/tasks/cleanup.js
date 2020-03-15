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
const loops_1 = require("../utilities/loops");
const time_1 = require("../utilities/time");
const logger_1 = __importDefault(require("../logger"));
const templates_1 = __importDefault(require("../templates"));
const logging_1 = __importDefault(require("../discord/logging"));
const events_1 = __importDefault(require("../discord/events"));
const members_1 = __importDefault(require("../database/members"));
const members_2 = __importDefault(require("../discord/members"));
function updateActivity(oldPresence, newPresence) {
    return __awaiter(this, void 0, void 0, function* () {
        if (newPresence.status === 'offline' || newPresence.status == 'online') {
            yield members_1.default.updateLastActivity(newPresence.user.id);
            if (newPresence.status == 'online') {
                logger_1.default.verbose(`${newPresence.member.displayName} has come online.`);
            }
            else {
                logger_1.default.verbose(`${newPresence.member.displayName} went ${newPresence.status}.`);
            }
        }
    });
}
function updateUsersInDB(oldMember, newMember) {
    return __awaiter(this, void 0, void 0, function* () {
        const roles = [];
        yield loops_1.forCollection(newMember.roles.cache, (role) => {
            roles.push(role.name);
        });
        if (roles.includes('Member') == true) {
            const exists = yield members_1.default.memberExists(newMember.id);
            if (exists == false) {
                yield members_1.default.addUserToDatabase(newMember);
                logger_1.default.verbose(`${newMember.displayName} has been added to the database.`);
            }
            else {
                yield members_1.default.updateDisplayName(newMember.id, newMember.displayName);
                logger_1.default.verbose(`${oldMember.displayName} has changed nickname to ${newMember.displayName}`);
            }
        }
        else {
            yield members_1.default.deleteUserFromDatabase(newMember.user.id);
            logger_1.default.verbose(`${oldMember.displayName} is no longer a member.`);
        }
    });
}
function kickUserIfInactive(member, memberInDB, config) {
    return __awaiter(this, void 0, void 0, function* () {
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
            yield members_1.default.deleteUserFromDatabase(member.id);
            yield logging_1.default.sendServerLog(`:recycle: **${member.displayName} has been kicked due to inactivity for 20+ days. ${(memberDMed == false) ? 'But, couldn\'t send him the direct message.' : ''}**`, config);
        }
        return false;
    });
}
function cleanUpServer(config) {
    return __awaiter(this, void 0, void 0, function* () {
        events_1.default.presenceChanged(updateActivity);
        events_1.default.guildMemberUpdate(updateUsersInDB);
        time_1.setInterval(((1000 * 60) * 60), () => __awaiter(this, void 0, void 0, function* () {
            const membersInDiscord = yield members_2.default.getAllMembers(config);
            yield loops_1.forEach(membersInDiscord, (member) => __awaiter(this, void 0, void 0, function* () {
                const memberInDB = yield members_1.default.getMember(member.id);
                yield kickUserIfInactive(member, memberInDB, config);
            }));
        }));
    });
}
exports.default = cleanUpServer;
