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
const command_line_args_1 = __importDefault(require("command-line-args"));
const logger_1 = __importDefault(require("./logger"));
exports.optionList = [
    {
        name: 'delay',
        alias: 'D',
        type: Number,
        typeLabel: '{underline <seconds>}',
        default: 0,
        description: 'Wait for number of seconds before starting up.'
    },
    {
        name: 'verbose',
        alias: 'V',
        type: Boolean,
        description: 'Display addition debug information.'
    },
    {
        name: 'version',
        alias: 'v',
        type: Boolean,
        description: 'Show the version information and terminate.'
    },
    {
        name: 'help',
        alias: 'h',
        type: Boolean,
        description: 'Show this help message and terminate.'
    }
];
function parseArgs() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const parsed = command_line_args_1.default(exports.optionList);
            return parsed;
        }
        catch (err) {
            logger_1.default.error(err, 1);
        }
    });
}
exports.default = parseArgs;
