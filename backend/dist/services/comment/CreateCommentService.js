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
exports.CreateCommentService = void 0;
const prisma_1 = __importDefault(require("../../prisma"));
class CreateCommentService {
    execute(_a) {
        return __awaiter(this, arguments, void 0, function* ({ serviceId, userId, text }) {
            if (!userId) {
                throw new Error('Invalid userId');
            }
            const service = yield prisma_1.default.service.findUnique({
                where: { id: serviceId }
            });
            if (!service) {
                throw new Error('Service not found');
            }
            const user = yield prisma_1.default.user.findUnique({
                where: { id: userId }
            });
            if (!user) {
                throw new Error('User not found');
            }
            const newComment = yield prisma_1.default.comment.create({
                data: {
                    serviceId,
                    userId,
                    text,
                },
                select: {
                    id: true,
                    serviceId: true,
                    userId: true,
                    text: true,
                    createdAt: true,
                },
            });
            return newComment;
        });
    }
}
exports.CreateCommentService = CreateCommentService;
