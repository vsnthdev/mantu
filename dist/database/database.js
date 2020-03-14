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
const path_1 = __importDefault(require("path"));
const knex_1 = __importDefault(require("knex"));
const execa_1 = __importDefault(require("execa"));
const logger_1 = __importDefault(require("../logger"));
const knexfile = require('../../knexfile');
const config = (process.env.NODE_ENV == 'production') ? knexfile['production'] : knexfile['development'];
function initializeTables() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield execa_1.default(path_1.default.join(process.cwd(), 'node_modules', '.bin', 'knex'), ['migrate:latest']);
            logger_1.default.success('Finished syncing database structure');
        }
        catch (e) {
            logger_1.default.error(e, 2);
        }
    });
}
function connectToDatabase() {
    return __awaiter(this, void 0, void 0, function* () {
        const tempDatabase = yield knex_1.default(config);
        try {
            yield tempDatabase('knex_migrations');
            yield initializeTables();
            logger_1.default.success('Finished connecting to the database');
        }
        catch (e) {
            logger_1.default.error(`Failed to connect to the database due to: ${e.message}`, 4);
        }
    });
}
exports.connectToDatabase = connectToDatabase;
exports.default = knex_1.default(config);
