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
exports.UpdateSubcommentService = void 0;
const prisma_1 = __importDefault(require("../../prisma"));
class UpdateSubcommentService {
    execute(_a) {
        return __awaiter(this, arguments, void 0, function* ({ subcommentId, text, userId }) {
            if (!subcommentId) {
                throw new Error("Subcomment ID is required");
            }
            if (!text) {
                throw new Error("Subcomment text is required");
            }
            if (!userId) {
                throw new Error("User ID is required");
            }
            const subcomment = yield prisma_1.default.subcomment.findUnique({
                where: { id: subcommentId },
            });
            if (!subcomment) {
                throw new Error("Subcomment not found");
            }
            if (subcomment.userId !== userId) {
                throw new Error("Only the subcomment author can update this subcomment");
            }
            const updatedSubcomment = yield prisma_1.default.subcomment.update({
                where: { id: subcommentId },
                data: {
                    text,
                    updatedAt: new Date(),
                },
                include: {
                    user: { select: { id: true, name: true } },
                },
            });
            return {
                id: updatedSubcomment.id,
                commentId: updatedSubcomment.commentId,
                userId: updatedSubcomment.userId,
                text: updatedSubcomment.text,
                createdAt: updatedSubcomment.createdAt,
                updatedAt: updatedSubcomment.updatedAt,
                user: updatedSubcomment.user,
            };
        });
    }
}
exports.UpdateSubcommentService = UpdateSubcommentService;
