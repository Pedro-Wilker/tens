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
exports.CreateUserService = void 0;
const prisma_1 = __importDefault(require("../../prisma"));
const bcryptjs_1 = require("bcryptjs");
const client_1 = require("@prisma/client");
class CreateUserService {
    execute(_a) {
        return __awaiter(this, arguments, void 0, function* ({ email, name, password, number, analfabeto }) {
            if (!email)
                throw new Error('Email incorrect');
            if (!number)
                throw new Error('Number cannot be empty');
            const numberRegex = /^\d{10,11}$/;
            if (!numberRegex.test(number)) {
                throw new Error('O número de telefone deve ter 10 ou 11 dígitos.');
            }
            const userAlreadyExistsByEmail = yield prisma_1.default.user.findFirst({
                where: { email },
            });
            if (userAlreadyExistsByEmail)
                throw new Error('User already exists with this email');
            const userAlreadyExistsByNumber = yield prisma_1.default.user.findFirst({
                where: { number },
            });
            if (userAlreadyExistsByNumber)
                throw new Error('User already exists with this number');
            const passwordHash = yield (0, bcryptjs_1.hash)(password, 8);
            const user = yield prisma_1.default.user.create({
                data: {
                    name,
                    email,
                    role: client_1.Role.CLIENT,
                    passwordHash,
                    number,
                    analfabeto: analfabeto !== null && analfabeto !== void 0 ? analfabeto : false,
                },
                select: {
                    id: true,
                    email: true,
                    role: true,
                    name: true,
                    number: true,
                    analfabeto: true,
                },
            });
            return user;
        });
    }
}
exports.CreateUserService = CreateUserService;
