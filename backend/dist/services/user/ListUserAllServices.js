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
exports.ListUserAllService = void 0;
const prisma_1 = __importDefault(require("../../prisma"));
class ListUserAllService {
    execute(user_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield prisma_1.default.user.findUnique({
                where: {
                    id: user_id,
                },
                include: {
                    services: {
                        include: {
                            serviceDetails: true,
                            ratings: true,
                            subcategory: true,
                        },
                    },
                    comments: {
                        include: {
                            subcomments: true,
                        },
                    },
                    ratings: true,
                },
            });
            if (!user) {
                throw new Error("Usuário não encontrado");
            }
            return {
                id: user.id,
                name: user.name,
                email: user.email,
                number: user.number,
                passwordHash: user.passwordHash,
                role: user.role,
                services: user.services,
                comments: user.comments,
                ratings: user.ratings,
                createdAt: user.createdAt.toISOString(),
                updatedAt: user.updatedAt.toISOString(),
            };
        });
    }
}
exports.ListUserAllService = ListUserAllService;
