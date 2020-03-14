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
const roles_1 = __importDefault(require("./roles"));
function getAllMembers(config) {
    return __awaiter(this, void 0, void 0, function* () {
        const role = yield roles_1.default.getBaseRole(config);
        return Array.from(role.members.values());
    });
}
function getMemberById(userId, config) {
    return __awaiter(this, void 0, void 0, function* () {
        const members = yield getAllMembers(config);
        return members.find(member => member.id == userId);
    });
}
exports.default = {
    getAllMembers,
    getMemberById
};
