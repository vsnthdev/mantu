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
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const config_1 = require("../../config");
const moderators_1 = __importDefault(require("../../discord/moderators"));
const channels_1 = __importDefault(require("../../discord/channels"));
const emojis_1 = __importDefault(require("../../discord/emojis"));
const discord_1 = require("../../discord/discord");
function respond(command, message, config) {
    return __awaiter(this, void 0, void 0, function* () {
        if (command == 'help') {
            discord_1.sendMessage(`${discord_1.getRandomEmoji(true)} A list of commands and what they do can be found at <#${config.get('channels').help}>`, message.channel);
            return true;
        }
        else {
            const access = yield moderators_1.default.onlyModerators(message, config);
            if (access == false)
                return false;
            const helpChannel = yield channels_1.default.getHelpChannel(config);
            yield helpChannel.bulkDelete(100);
            let helpString = yield fs_1.default.promises.readFile(path_1.default.join(process.cwd(), 'help.md'), { encoding: 'UTF-8' });
            helpString = yield emojis_1.default.renderString(helpString);
            yield helpChannel.send(`${helpString}**\`mantu v${config_1.appInfo.version}\` **`.replace(/{prefix}/g, config.get('prefix')));
            discord_1.sendMessage(`${discord_1.getRandomEmoji(true)} The help message has been updated at <#${config.get('channels').help}>`, message.channel);
            return true;
        }
    });
}
exports.default = respond;
