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
exports.ListUserAllController = void 0;
const ListUserAllServices_1 = require("../../services/user/ListUserAllServices");
class ListUserAllController {
    handle(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const user_id = Number(req.user_id);
            const listUserAllService = new ListUserAllServices_1.ListUserAllService();
            try {
                const user = yield listUserAllService.execute(user_id);
                return res.json(user);
            }
            catch (err) {
                console.error('Erro no controlador:', err.message);
                return res.status(400).json({ error: err.message });
            }
        });
    }
}
exports.ListUserAllController = ListUserAllController;
