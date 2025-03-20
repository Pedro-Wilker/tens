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
exports.AuthUserService = void 0;
const prisma_1 = __importDefault(require("../../prisma"));
const bcryptjs_1 = require("bcryptjs");
const jsonwebtoken_1 = require("jsonwebtoken");
class AuthUserService {
    execute(_a) {
        return __awaiter(this, arguments, void 0, function* ({ email, password }) {
            const user = yield prisma_1.default.user.findFirst({
                where: {
                    email: email,
                },
            });
            if (!user) {
                throw new Error("User/password incorrect");
            }
            const passwordMatch = yield (0, bcryptjs_1.compare)(password, user.passwordHash);
            if (!passwordMatch) {
                throw new Error("User/password incorrect");
            }
            const userIdAsString = String(user.id);
            if (!userIdAsString || typeof userIdAsString !== 'string') {
                throw new Error('Failed to convert user.id to string');
            }
            try {
                const token = (0, jsonwebtoken_1.sign)({
                    name: user.name,
                    email: user.email,
                    role: user.role,
                }, process.env.JWT_SECRET, {
                    subject: userIdAsString,
                    expiresIn: "30d",
                });
                return {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                    token: token,
                };
            }
            catch (error) {
                console.error('AuthUserService - JWT Error:', error.message);
                throw new Error(error.message);
            }
        });
    }
}
exports.AuthUserService = AuthUserService;
