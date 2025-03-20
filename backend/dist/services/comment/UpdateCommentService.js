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
exports.UpdateCommentService = void 0;
const prisma_1 = __importDefault(require("../../prisma"));
class UpdateCommentService {
    execute(_a) {
        return __awaiter(this, arguments, void 0, function* ({ commentId, text, userId }) {
            if (!commentId) {
                throw new Error("Comment ID is required");
            }
            if (!text) {
                throw new Error("Comment text is required");
            }
            if (!userId) {
                throw new Error("User ID is required");
            }
            const comment = yield prisma_1.default.comment.findUnique({
                where: { id: commentId },
            });
            if (!comment) {
                throw new Error("Comment not found");
            }
            if (comment.userId !== userId) {
                throw new Error("Only the comment author can update this comment");
            }
            const updatedComment = yield prisma_1.default.comment.update({
                where: { id: commentId },
                data: {
                    text,
                    updatedAt: new Date(),
                },
                include: {
                    user: { select: { id: true, name: true } },
                    service: { select: { id: true, name: true } },
                },
            });
            return {
                id: updatedComment.id,
                serviceId: updatedComment.serviceId,
                userId: updatedComment.userId,
                text: updatedComment.text,
                createdAt: updatedComment.createdAt,
                updatedAt: updatedComment.updatedAt,
                user: updatedComment.user,
                service: updatedComment.service,
            };
        });
    }
}
exports.UpdateCommentService = UpdateCommentService;
