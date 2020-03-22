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
const loops_1 = require("../utilities/loops");
const roles_1 = __importDefault(require("./roles"));
function getAllModerators(config) {
    return __awaiter(this, void 0, void 0, function* () {
        const moderatorRoles = yield roles_1.default.getModeratorRoles(config);
        const moderators = [];
        yield loops_1.forEach(moderatorRoles, (moderatorRole) => __awaiter(this, void 0, void 0, function* () {
            const moderatorsInRole = Array.from(moderatorRole.members.values());
            yield loops_1.forEach(moderatorsInRole, (moderator) => __awaiter(this, void 0, void 0, function* () {
                const exists = moderators.find(mod => mod.id == moderator.id);
                if (!exists) {
                    moderators.push(moderator);
                }
            }));
        }));
        return moderators;
    });
}
function onlyModerators(message, config) {
    return __awaiter(this, void 0, void 0, function* () {
        const mods = config.get('roles').moderators;
        let giveAccess = false;
        yield loops_1.forEach(mods, (roleId) => __awaiter(this, void 0, void 0, function* () {
            const roleExists = message.member.roles.cache.find(role => role.id == roleId);
            if (roleExists) {
                giveAccess = true;
            }
        }));
        if (giveAccess == false)
            message.channel.send(':beetle: **You don\'t have access to this command.** :person_shrugging:');
        return giveAccess;
    });
}
exports.onlyModerators = onlyModerators;
exports.default = {
    getAllModerators,
    onlyModerators
};
