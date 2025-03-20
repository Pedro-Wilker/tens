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
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeleteCommentController = void 0;
const DeleteCommentService_1 = require("../../services/comment/DeleteCommentService");
class DeleteCommentController {
    handle(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { commentId } = req.params;
            const userId = Number(req.user_id);
            if (!userId) {
                return res.status(401).json({ error: "User not authenticated" });
            }
            try {
                const deleteCommentService = new DeleteCommentService_1.DeleteCommentService();
                const result = yield deleteCommentService.execute({ commentId: Number(commentId), userId });
                return res.status(200).json(result);
            }
            catch (error) {
                return res.status(400).json({ error: error.message });
            }
        });
    }
}
exports.DeleteCommentController = DeleteCommentController;
