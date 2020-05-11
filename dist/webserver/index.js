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
const express_1 = __importDefault(require("express"));
const logger_1 = __importDefault(require("../logger"));
const invites_1 = __importDefault(require("../discord/invites"));
const web = express_1.default();
let localConfig;
let ips = [];
function startWebserver(config) {
    return __awaiter(this, void 0, void 0, function* () {
        web.listen(config.get('server').port, () => {
            logger_1.default.info(`Webserver is ready to handle incoming requests on port ${config.get('server').port}.`);
        });
        localConfig = config;
        return;
    });
}
exports.default = startWebserver;
function rateLimit(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const found = ips.find(ip => ip.ip == req.ip.toString());
        if (found) {
            if (found.count > 5) {
                logger_1.default.okay(`Rate limited "${req.ip.toString()}".`);
                res.status(429).json({
                    error: true,
                    message: 'Too many requests.'
                });
            }
            else {
                found.count = found.count + 1;
                logger_1.default.okay(`Creating an invite link for the "${found.count.toString()}" time from "${req.ip.toString()}".`);
                next();
            }
        }
        else {
            const pushable = {
                ip: req.ip.toString(),
                count: 1
            };
            ips.push(pushable);
            logger_1.default.okay(`Creating a new invite for "${req.ip.toString()}".`);
            next();
        }
    });
}
web.get('/', rateLimit, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.redirect(yield invites_1.default.createInvite(localConfig));
}));
setTimeout(() => {
    logger_1.default.okay('Flushing invite link IPs');
    ips = [];
}, (1000 * 60) * 30);
