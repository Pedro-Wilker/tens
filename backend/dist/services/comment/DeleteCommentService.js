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
exports.DeleteCommentService = void 0;
const prisma_1 = __importDefault(require("../../prisma"));
class DeleteCommentService {
    execute(_a) {
        return __awaiter(this, arguments, void 0, function* ({ commentId, userId }) {
            const comment = yield prisma_1.default.comment.findUnique({
                where: { id: commentId },
                include: { subcomments: true },
            });
            if (!comment) {
                throw new Error("Comment not found");
            }
            if (comment.userId !== userId) {
                throw new Error("Only the comment author can delete this comment");
            }
            if (comment.subcomments.length > 0) {
                throw new Error("Cannot delete comment with associated subcomments");
            }
            yield prisma_1.default.comment.delete({
                where: { id: commentId },
            });
            return { message: "Comment deleted successfully" };
        });
    }
}
exports.DeleteCommentService = DeleteCommentService;
