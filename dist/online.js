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
const logger_1 = __importDefault(require("./logger"));
const events_1 = __importDefault(require("./discord/events"));
const logging_1 = __importDefault(require("./discord/logging"));
const discord_1 = require("./discord/discord");
const init_1 = __importDefault(require("./database/init"));
const error_1 = require("./utilities/error");
const index_1 = __importDefault(require("./interactions/index"));
const cleanup_1 = __importDefault(require("./tasks/cleanup"));
function linkCommands(config) {
    return __awaiter(this, void 0, void 0, function* () {
        events_1.default.commandReceived(config, (command, message) => __awaiter(this, void 0, void 0, function* () {
            let commandExecutionSuccessful = false;
            if (command.startsWith('info')) {
                commandExecutionSuccessful = yield index_1.default.moderation.info(command, message, config);
            }
            else if (command.startsWith('timezone ')) {
                commandExecutionSuccessful = yield index_1.default.conversion.timezone(command, message);
            }
            else if (command.startsWith('time ') || command == 'time') {
                commandExecutionSuccessful = yield index_1.default.conversion.time(command, message);
            }
            else if (command.startsWith('country ')) {
                commandExecutionSuccessful = yield index_1.default.conversion.country(command, message);
            }
            else if (command.startsWith('cash ')) {
                commandExecutionSuccessful = yield index_1.default.conversion.cash(command, message);
            }
            else if (command.startsWith('github ')) {
                commandExecutionSuccessful = yield index_1.default.github.github(command, message, config);
            }
            else if (command.startsWith('clear ')) {
                yield index_1.default.moderation.clear(command, message, config);
            }
            else if (command == 'server stats') {
                commandExecutionSuccessful = yield index_1.default.moderation.serverStats(message, config);
            }
            else if (command == 'server invite') {
                commandExecutionSuccessful = yield index_1.default.utilities.serverLink(message, config);
            }
            else if (command == 'help' || command == 'helpMessage') {
                commandExecutionSuccessful = yield index_1.default.moderation.help(command, message, config);
            }
            if (config.get('deleteCommandAfterExecution') == true && commandExecutionSuccessful == true) {
                const deleteMessage = yield error_1.errorHandler(message.delete());
                if (deleteMessage.e) {
                    yield logging_1.default.sendDiscordError(deleteMessage.e, message.member, message.channel, config);
                }
            }
        }));
    });
}
function online(config) {
    return __awaiter(this, void 0, void 0, function* () {
        return () => __awaiter(this, void 0, void 0, function* () {
            logger_1.default.success('The bot is online and ready');
            yield discord_1.setStatus();
            yield init_1.default(config);
            yield linkCommands(config);
            yield cleanup_1.default(config);
        });
    });
}
exports.default = online;
