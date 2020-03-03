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
const discord_1 = __importDefault(require("../discord"));
const database_1 = __importDefault(require("../database"));
const logger_1 = __importDefault(require("../logger"));
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
        const membersInDB = yield database_1.default.queries.getAllMembers();
        let discordMembersId = [];
        yield forEach(members, (member) => __awaiter(this, void 0, void 0, function* () {
            let exists = yield database_1.default.queries.memberExists(member.user.id);
            discordMembersId.push(member.user.id);
            if (exists == false) {
                logger_1.default.verbose(`Adding user: ${member.displayName} to the database`);
                database_1.default.queries.addUserToDatabase(member);
            }
            else {
                yield database_1.default.queries.updateDisplayName(member.user.id, member.displayName);
            }
        }));
        yield forEach(membersInDB, (member) => __awaiter(this, void 0, void 0, function* () {
            const exists = discordMembersId.includes(member.id);
            if (exists == false) {
                logger_1.default.verbose(`Removing user: ${member.name} from the database.`);
                database_1.default.queries.deleteUserFromDatabase(member.id);
            }
        }));
    });
}
function updateActivity(oldMember, newMember) {
    return __awaiter(this, void 0, void 0, function* () {
        if (newMember.presence.status === 'offline' || newMember.presence.status == 'online') {
            yield database_1.default.queries.updateLastActivity(newMember.user.id);
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
            yield database_1.default.queries.addUserToDatabase(newMember);
        }
        else {
            yield database_1.default.queries.deleteUserFromDatabase(newMember.user.id);
        }
    });
}
