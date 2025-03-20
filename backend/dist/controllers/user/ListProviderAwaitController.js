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
exports.ListProviderAwaitController = void 0;
const ListProviderAwaitService_1 = require("../../services/user/ListProviderAwaitService");
class ListProviderAwaitController {
    handle(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const listProviderAwaitService = new ListProviderAwaitService_1.ListProviderAwaitService();
            try {
                const providersAwait = yield listProviderAwaitService.execute();
                return res.json(providersAwait);
            }
            catch (error) {
                return res.status(400).json({ error: error.message });
            }
        });
    }
}
exports.ListProviderAwaitController = ListProviderAwaitController;
