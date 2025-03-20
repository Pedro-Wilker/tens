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
exports.UpdateUserController = void 0;
const UpdateUserService_1 = require("../../services/user/UpdateUserService");
class UpdateUserController {
    handle(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { userId } = req.params;
            const currentUserId = Number(req.user_id);
            const { name, email, number, password, role } = req.body;
            if (!currentUserId) {
                return res.status(401).json({ error: "User not authenticated" });
            }
            try {
                const updateUserService = new UpdateUserService_1.UpdateUserService();
                const updatedUser = yield updateUserService.execute({
                    userId: Number(userId),
                    name,
                    email,
                    number,
                    password,
                    role,
                    currentUserId,
                });
                return res.status(200).json(updatedUser);
            }
            catch (error) {
                console.error("Erro no UpdateUserController:", error.message);
                return res.status(400).json({ error: error.message });
            }
        });
    }
}
exports.UpdateUserController = UpdateUserController;
