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
const error_1 = require("../../utilities/error");
const moderators_1 = __importDefault(require("../../discord/moderators"));
const logging_1 = __importDefault(require("../../discord/logging"));
const discord_1 = require("../../discord/discord");
function respond(command, message, config) {
    return __awaiter(this, void 0, void 0, function* () {
        const parsed = parseInt(command.substring(6));
        if (isNaN(parsed)) {
            discord_1.sendMessage(':beetle: **Invalid number provided with clear command.**', message.channel);
        }
        else {
            const access = yield moderators_1.default.onlyModerators(message, config);
            if (access == false)
                return;
            if (parsed >= 1000) {
                discord_1.sendMessage(':beetle: **Deleting more than 1000 messages isn\'t supported.**', message.channel);
                return;
            }
            const blocks = parsed / 100;
            let deletedCount = 0;
            let error;
            if (blocks > 1) {
                for (let index = 1; index <= blocks; index++) {
                    const deleted = yield error_1.errorHandler(message.channel.bulkDelete(100));
                    if (deleted.e) {
                        error = deleted.e;
                    }
                    else {
                        deletedCount = deletedCount + Array.from(deleted.data).length;
                    }
                }
                const remaining = (100 * blocks) - parsed;
                if (remaining >= 1) {
                    const deleted = yield error_1.errorHandler(message.channel.bulkDelete(remaining));
                    if (deleted.e) {
                        error = deleted.e;
                    }
                    else {
                        deletedCount = deletedCount + Array.from(deleted.data).length;
                    }
                }
            }
            else {
                const deleted = yield error_1.errorHandler(message.channel.bulkDelete(parsed));
                if (deleted.e) {
                    error = deleted.e;
                }
                else {
                    deletedCount = deletedCount + Array.from(deleted.data).length;
                }
            }
            if (error) {
                yield logging_1.default.sendDiscordError(error, message.member, message.channel, config);
            }
            else {
                yield (yield discord_1.sendMessage(`:koala: **Deleted ${deletedCount - 1} messages.**`, message.channel)).delete({ timeout: 2000 });
            }
        }
    });
}
exports.default = respond;
