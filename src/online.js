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
const discord_1 = __importDefault(require("./discord"));
const cleanup_1 = __importDefault(require("./tasks/cleanup"));
const userActivityInfo_1 = __importDefault(require("./interactions/userActivityInfo"));
function online(config) {
    return __awaiter(this, void 0, void 0, function* () {
        return () => __awaiter(this, void 0, void 0, function* () {
            logger_1.default.success('The bot is online and ready');
            yield discord_1.default.setStatus();
            yield linkCommands(config);
            yield cleanup_1.default(config)();
        });
    });
}
exports.default = online;
function linkCommands(config) {
    return __awaiter(this, void 0, void 0, function* () {
        discord_1.default.events.commandReceived(config, (command, message) => __awaiter(this, void 0, void 0, function* () {
            let commandExecutionSuccessful = false;
            if (command.startsWith('info ')) {
                commandExecutionSuccessful = yield userActivityInfo_1.default(message, config);
            }
            if (config.get('deleteCommandAfterExecution') == true && commandExecutionSuccessful == true) {
                message.delete();
            }
        }));
    });
}
