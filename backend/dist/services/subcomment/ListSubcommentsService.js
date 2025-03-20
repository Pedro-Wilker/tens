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
exports.ListSubcommentsService = void 0;
const prisma_1 = __importDefault(require("../../prisma"));
class ListSubcommentsService {
    execute(_a) {
        return __awaiter(this, arguments, void 0, function* ({ commentId }) {
            const comment = yield prisma_1.default.comment.findUnique({
                where: { id: commentId },
            });
            if (!comment) {
                throw new Error("Parent comment not found");
            }
            const subcomments = yield prisma_1.default.subcomment.findMany({
                where: {
                    commentId,
                },
                select: {
                    id: true,
                    text: true,
                    createdAt: true,
                    updatedAt: true,
                    user: {
                        select: {
                            id: true,
                            name: true,
                        },
                    },
                },
                orderBy: {
                    createdAt: "desc",
                },
            });
            return subcomments;
        });
    }
}
exports.ListSubcommentsService = ListSubcommentsService;
