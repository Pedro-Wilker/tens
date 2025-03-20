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
exports.ApproveProviderService = void 0;
const prisma_1 = __importDefault(require("../../prisma"));
const client_1 = require("@prisma/client");
class ApproveProviderService {
    execute(_a) {
        return __awaiter(this, arguments, void 0, function* ({ userId }) {
            const user = yield prisma_1.default.user.findUnique({
                where: { id: userId }
            });
            if (!user) {
                throw new Error('User not found');
            }
            if (user.role !== client_1.Role.PROVIDERAWAIT) {
                throw new Error('User is not awaiting approval to be a provider');
            }
            const updatedUser = yield prisma_1.default.user.update({
                where: { id: userId },
                data: {
                    role: client_1.Role.PROVIDER
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
exports.ApproveProviderService = ApproveProviderService;
