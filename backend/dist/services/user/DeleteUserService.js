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
exports.DeleteUserService = void 0;
const prisma_1 = __importDefault(require("../../prisma"));
class DeleteUserService {
    execute(_a) {
        return __awaiter(this, arguments, void 0, function* ({ userId, currentUserId }) {
            if (!userId) {
                throw new Error("User ID is required");
            }
            const user = yield prisma_1.default.user.findUnique({
                where: { id: userId },
                include: { services: true, comments: true, ratings: true },
            });
            if (!user) {
                throw new Error("User not found");
            }
            if (currentUserId !== userId) {
                const currentUser = yield prisma_1.default.user.findUnique({
                    where: { id: currentUserId },
                });
                if (!currentUser || (currentUser.role !== "ADMIN" && currentUser.role !== "SUPPORT")) {
                    throw new Error("Only the user or an admin/support can delete this user");
                }
            }
            if (user.services.length > 0 || user.comments.length > 0 || user.ratings.length > 0) {
                throw new Error("Cannot delete user with associated services, comments, or ratings");
            }
            yield prisma_1.default.user.delete({
                where: { id: userId },
            });
            return { message: "User deleted successfully" };
        });
    }
}
exports.DeleteUserService = DeleteUserService;
