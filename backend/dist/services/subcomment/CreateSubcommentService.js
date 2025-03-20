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
exports.CreateSubcommentService = void 0;
const prisma_1 = __importDefault(require("../../prisma"));
class CreateSubcommentService {
    execute(_a) {
        return __awaiter(this, arguments, void 0, function* ({ commentId, userId, text }) {
            const comment = yield prisma_1.default.comment.findUnique({
                where: { id: commentId },
            });
            if (!comment) {
                throw new Error("Parent comment not found");
            }
            const user = yield prisma_1.default.user.findUnique({
                where: { id: userId },
            });
            if (!user) {
                throw new Error("User not found");
            }
            const subcomment = yield prisma_1.default.subcomment.create({
                data: {
                    commentId,
                    userId,
                    text,
                },
                select: {
                    id: true,
                    commentId: true,
                    userId: true,
                    text: true,
                    createdAt: true,
                    updatedAt: true,
                },
            });
            return subcomment;
        });
    }
}
exports.CreateSubcommentService = CreateSubcommentService;
