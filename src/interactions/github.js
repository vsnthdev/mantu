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
const github_api_1 = __importDefault(require("github-api"));
function respond(command, message) {
    return __awaiter(this, void 0, void 0, function* () {
        const parse = command.substring(7).split('/');
        if (parse.length > 2) {
            message.channel.send(':beetle: **Invalid input provided. Run for example** `;github vasanthdeveloper/samaya`');
            return false;
        }
        if (parse.length == 1) {
            const git = new github_api_1.default();
            const user = (yield (yield git.getUser(parse[0])).getProfile()).data;
            console.log(user);
        }
        else {
        }
        return false;
    });
}
exports.default = respond;
