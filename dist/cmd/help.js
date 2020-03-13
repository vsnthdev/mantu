"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const command_line_usage_1 = __importDefault(require("command-line-usage"));
const cli_1 = require("../cli");
const sections = [
    {
        header: 'mantu',
        content: 'A Discord bot to manage Vasanth Developer server.'
    },
    {
        header: 'Synopsis',
        content: [
            '$ mantu --verbose'
        ]
    },
    {
        header: 'App Options',
        group: '_none',
        optionList: cli_1.optionList
    }
];
exports.default = command_line_usage_1.default(sections);
