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
exports.DeleteSubcommentService = void 0;
const prisma_1 = __importDefault(require("../../prisma"));
class DeleteSubcommentService {
    execute(_a) {
        return __awaiter(this, arguments, void 0, function* ({ subcommentId, userId }) {
            const subcomment = yield prisma_1.default.subcomment.findUnique({
                where: { id: subcommentId },
            });
            if (!subcomment) {
                throw new Error("Subcomment not found");
            }
            if (subcomment.userId !== userId) {
                throw new Error("Only the subcomment author can delete this subcomment");
            }
            yield prisma_1.default.subcomment.delete({
                where: { id: subcommentId },
            });
            return { message: "Subcomment deleted successfully" };
        });
    }
}
exports.DeleteSubcommentService = DeleteSubcommentService;
