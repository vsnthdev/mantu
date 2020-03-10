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
const moment_1 = __importDefault(require("moment"));
const execa_1 = __importDefault(require("execa"));
const logger_1 = __importDefault(require("./logger"));
const knexfile = require('../knexfile');
const config = (process.env.NODE_ENV == 'production') ? knexfile['production'] : knexfile['development'];
let database;
function connectToDatabase() {
    return __awaiter(this, void 0, void 0, function* () {
        const tempDatabase = yield knex_1.default(config);
        try {
            yield initializeTables();
            yield tempDatabase('knex_migrations');
            logger_1.default.success('Finished connecting to the database');
            database = tempDatabase;
        }
        catch (e) {
            logger_1.default.error(`Failed to connect to the database due to: ${e.message}`, 4);
        }
    });
}
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
function getAllMembers() {
    return __awaiter(this, void 0, void 0, function* () {
        return yield database('members');
    });
}
function memberExists(id) {
    return __awaiter(this, void 0, void 0, function* () {
        const exists = yield database('members').where({ id }).first().select();
        if (exists) {
            return true;
        }
        else {
            return false;
        }
    });
}
function addUserToDatabase(member) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield database('members')
            .insert({
            id: member.user.id,
            name: member.displayName,
            lastActive: moment_1.default().format('x')
        });
    });
}
function deleteUserFromDatabase(userId) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield database('members')
            .where({ id: userId })
            .delete();
    });
}
function updateDisplayName(userId, newDisplayName) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield database('members')
            .where({ id: userId })
            .update({
            name: newDisplayName
        });
    });
}
function updateLastActivity(userId) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield database('members')
            .where({ id: userId })
            .update({
            lastActive: moment_1.default().format('x')
        });
    });
}
function setTimezone(userId, timezone) {
    return __awaiter(this, void 0, void 0, function* () {
        yield database('members')
            .where({ id: userId })
            .update({
            timezone
        });
    });
}
function setCountry(userId, country) {
    return __awaiter(this, void 0, void 0, function* () {
        yield database('members')
            .where({ id: userId })
            .update({
            country
        });
    });
}
function getMember(userId) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield database('members')
            .where({ id: userId })
            .first()
            .select();
    });
}
function getCountryByName(name) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield database('countries')
            .where({ name: name })
            .first()
            .select();
    });
}
function getCountryByAlpha2(code) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield database('countries')
            .where({ alpha2code: code })
            .first()
            .select();
    });
}
function getCountryByAlpha3(code) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield database('countries')
            .where({ alpha3code: code })
            .first()
            .select();
    });
}
function addCountry(country) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield database('countries')
            .insert({
            name: `${country.name}`.toLowerCase(),
            nativeName: country.nativeName,
            alpha2code: country.alpha2Code,
            alpha3code: country.alpha3Code,
            cashCode: country.currencies[0].code,
            cashSymbol: country.currencies[0].symbol
        });
    });
}
function addCashTranslation(code, value) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield database('cashTranslate')
            .insert({ code, value });
    });
}
function resetCashTranslation() {
    return __awaiter(this, void 0, void 0, function* () {
        yield database('cashTranslate')
            .del();
    });
}
function getRates() {
    return __awaiter(this, void 0, void 0, function* () {
        return yield database('cashTranslate');
    });
}
const exportable = {
    config: config,
    connect: connectToDatabase,
    queries: {
        initializeTables,
        members: {
            getAllMembers,
            getMember,
            memberExists,
            addUserToDatabase,
            deleteUserFromDatabase,
            updateDisplayName,
            updateLastActivity,
            setTimezone,
            setCountry
        },
        countries: {
            getCountryByName,
            getCountryByAlpha2,
            getCountryByAlpha3,
            addCountry
        },
        cashTranslate: {
            addCashTranslation,
            resetCashTranslation,
            getRates
        }
    }
};
exports.default = exportable;
