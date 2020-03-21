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
const logger_1 = __importDefault(require("../logger"));
const discord_1 = __importDefault(require("./discord"));
const loops_1 = require("../utilities/loops");
function getBaseRole(config) {
    return __awaiter(this, void 0, void 0, function* () {
        const guild = discord_1.default.guilds.cache.first();
        const baseRole = guild.roles.cache.find(role => role.id === config.get('roles').base);
        if (!baseRole) {
            logger_1.default.error(`A role with id ${config.get('roles').base} does not exist.`, 6);
        }
        else {
            return baseRole;
        }
    });
}
function getModeratorRoles(config) {
    return __awaiter(this, void 0, void 0, function* () {
        const guild = discord_1.default.guilds.cache.first();
        const returnable = [];
        if (config.get('roles').moderators.length < 1) {
            logger_1.default.error('No moderators specified in the configuration.');
            return [];
        }
        else {
            yield loops_1.forEach(config.get('roles').moderators, (moderator) => __awaiter(this, void 0, void 0, function* () {
                returnable.push(guild.roles.cache.find(role => role.id == moderator));
            }));
            return returnable;
        }
    });
}
function getAllRoles() {
    return __awaiter(this, void 0, void 0, function* () {
        const guild = discord_1.default.guilds.cache.first();
        return Array.from(guild.roles.cache.values());
    });
}
exports.default = {
    getBaseRole,
    getAllRoles,
    getModeratorRoles
};
