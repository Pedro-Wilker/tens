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
exports.CreateRoleController = void 0;
const CreateRoleService_1 = require("../../services/user/CreateRoleService");
class CreateRoleController {
    handle(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { userId, roleSelection } = req.body;
            if (!userId || isNaN(Number(userId))) {
                return res.status(400).json({ error: 'Invalid User ID' });
            }
            const roleService = new CreateRoleService_1.CreateRoleService();
            try {
                const user = yield roleService.execute({ userId: Number(userId), roleSelection });
                return res.status(200).json(user);
            }
            catch (error) {
                return res.status(400).json({ error: error.message });
            }
        });
    }
}
exports.CreateRoleController = CreateRoleController;
