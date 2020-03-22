"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const info_1 = __importDefault(require("./moderation/info"));
const clear_1 = __importDefault(require("./moderation/clear"));
const serverStats_1 = __importDefault(require("./moderation/serverStats"));
const helpMessage_1 = __importDefault(require("./moderation/helpMessage"));
const serverInvite_1 = __importDefault(require("./utilities/serverInvite"));
const github_1 = __importDefault(require("./github/github"));
const timezone_1 = __importDefault(require("./conversion/timezone"));
const country_1 = __importDefault(require("./conversion/country"));
const cash_1 = __importDefault(require("./conversion/cash"));
const time_1 = __importDefault(require("./conversion/time"));
exports.default = {
    moderation: {
        info: info_1.default,
        clear: clear_1.default,
        serverStats: serverStats_1.default,
        help: helpMessage_1.default
    },
    utilities: {
        serverLink: serverInvite_1.default
    },
    github: {
        github: github_1.default
    },
    conversion: {
        timezone: timezone_1.default,
        country: country_1.default,
        cash: cash_1.default,
        time: time_1.default
    }
};
