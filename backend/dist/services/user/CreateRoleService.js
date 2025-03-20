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
exports.CreateRoleService = void 0;
const prisma_1 = __importDefault(require("../../prisma"));
const client_1 = require("@prisma/client");
class CreateRoleService {
    execute(_a) {
        return __awaiter(this, arguments, void 0, function* ({ userId, roleSelection }) {
            const user = yield prisma_1.default.user.findUnique({
                where: { id: userId }
            });
            if (!user) {
                throw new Error('User not found');
            }
            let newRole;
            if (roleSelection === 'CLIENT') {
                newRole = client_1.Role.CLIENT;
            }
            else if (roleSelection === 'PROVIDER') {
                newRole = client_1.Role.PROVIDERAWAIT;
            }
            else {
                throw new Error('Invalid role selection');
            }
            const updatedUser = yield prisma_1.default.user.update({
                where: { id: userId },
                data: {
                    role: newRole
                },
                select: {
                    id: true,
                    email: true,
                    role: true,
                    name: true,
                    number: true,
                },
            });
            return updatedUser;
        });
    }
}
exports.CreateRoleService = CreateRoleService;
