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
const database_1 = __importDefault(require("./database"));
function getCountryByName(name) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield database_1.default('countries')
            .where({ name: name })
            .first()
            .select();
    });
}
function getCountryByAlpha2(code) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield database_1.default('countries')
            .where({ alpha2code: code })
            .first()
            .select();
    });
}
function getCountryByAlpha3(code) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield database_1.default('countries')
            .where({ alpha3code: code })
            .first()
            .select();
    });
}
function addCountry(country) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield database_1.default('countries')
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
exports.default = {
    getCountryByName,
    getCountryByAlpha2,
    getCountryByAlpha3,
    addCountry
};
