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
exports.UpdateUserService = void 0;
const prisma_1 = __importDefault(require("../../prisma"));
const bcryptjs_1 = require("bcryptjs");
class UpdateUserService {
    execute(_a) {
        return __awaiter(this, arguments, void 0, function* ({ userId, name, email, number, password, role, currentUserId }) {
            if (!userId) {
                throw new Error("User ID is required");
            }
            if (!name && !email && !number && !password && !role) {
                throw new Error("At least one field (name, email, number, password, or role) must be provided to update");
            }
            const user = yield prisma_1.default.user.findUnique({
                where: { id: userId },
            });
            if (!user) {
                throw new Error("User not found");
            }
            if (currentUserId && currentUserId !== userId) {
                const currentUser = yield prisma_1.default.user.findUnique({
                    where: { id: currentUserId },
                });
                if (!currentUser || (currentUser.role !== "ADMIN" && currentUser.role !== "SUPPORT")) {
                    throw new Error("Only the user or an admin/support can update this user");
                }
            }
            if (email && email !== user.email) {
                const emailAlreadyExists = yield prisma_1.default.user.findUnique({
                    where: { email },
                });
                if (emailAlreadyExists) {
                    throw new Error("Email already exists");
                }
            }
            if (number && number !== user.number) {
                const numberAlreadyExists = yield prisma_1.default.user.findUnique({
                    where: { number },
                });
                if (numberAlreadyExists) {
                    throw new Error("Phone number already exists");
                }
            }
            if (role && currentUserId && currentUserId !== userId) {
                const currentUser = yield prisma_1.default.user.findUnique({
                    where: { id: currentUserId },
                });
                if (!currentUser || (currentUser.role !== "ADMIN" && currentUser.role !== "SUPPORT")) {
                    throw new Error("Only admins or support can update user roles");
                }
            }
            const updateData = {};
            if (name)
                updateData.name = name;
            if (email)
                updateData.email = email;
            if (number)
                updateData.number = number;
            if (password)
                updateData.passwordHash = yield (0, bcryptjs_1.hash)(password, 8);
            if (role && currentUserId) {
                const currentUser = yield prisma_1.default.user.findUnique({
                    where: { id: currentUserId },
                });
                if (currentUser && (currentUser.role === "ADMIN" || currentUser.role === "SUPPORT")) {
                    updateData.role = role;
                }
            }
            const updatedUser = yield prisma_1.default.user.update({
                where: { id: userId },
                data: updateData,
                select: {
                    id: true,
                    name: true,
                    email: true,
                    number: true,
                    role: true,
                    createdAt: true,
                    updatedAt: true,
                },
            });
            return updatedUser;
        });
    }
}
exports.UpdateUserService = UpdateUserService;
