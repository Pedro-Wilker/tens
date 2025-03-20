"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = require("express");
const multer_1 = __importDefault(require("multer"));
const CreateUserController_1 = require("./controllers/user/CreateUserController");
const AuthUserController_1 = require("./controllers/user/AuthUserController");
const GetUsersByRoleController_1 = require("./controllers/user/GetUsersByRoleController");
const DetailUserController_1 = require("./controllers/user/DetailUserController");
const CreateRoleController_1 = require("./controllers/user/CreateRoleController");
const ApproveProviderController_1 = require("./controllers/user/ApproveProviderController");
const ListProviderAwaitController_1 = require("./controllers/user/ListProviderAwaitController");
const UpdateUserController_1 = require("./controllers/user/UpdateUserController");
const DeleteUserController_1 = require("./controllers/user/DeleteUserController");
const CreateCategoryController_1 = require("./controllers/category/CreateCategoryController");
const DetailCategoryController_1 = require("./controllers/category/DetailCategoryController");
const ListCategoriesController_1 = require("./controllers/category/ListCategoriesController");
const GetCategoryByNameController_1 = require("./controllers/category/GetCategoryByNameController");
const UpdateCategoryController_1 = require("./controllers/category/UpdateCategoryController");
const DeleteCategoryController_1 = require("./controllers/category/DeleteCategoryController");
const CreateSubcategoryController_1 = require("./controllers/subcategoires/CreateSubcategoryController");
const UpdateSubcategoryController_1 = require("./controllers/subcategoires/UpdateSubcategoryController");
const DeleteSubcategoryController_1 = require("./controllers/subcategoires/DeleteSubcategoryController");
const ListAllSubcategoriesController_1 = require("./controllers/subcategoires/ListAllSubcategoriesController");
const ListSubcategoriesByIdController_1 = require("./controllers/subcategoires/ListSubcategoriesByIdController");
const ListSubcategoriesByNameController_1 = require("./controllers/subcategoires/ListSubcategoriesByNameController");
const CreateServController_1 = require("./controllers/service/CreateServController");
const DetailServController_1 = require("./controllers/service/DetailServController");
const ListAllServicesController_1 = require("./controllers/service/ListAllServicesController");
const ListServicesByCategoryController_1 = require("./controllers/service/ListServicesByCategoryController");
const UpdateServiceController_1 = require("./controllers/service/UpdateServiceController");
const DeleteServiceController_1 = require("./controllers/service/DeleteServiceController");
const CreateSDController_1 = require("./controllers/serviceDetail/CreateSDController");
const DetailSDController_1 = require("./controllers/serviceDetail/DetailSDController");
const ListServiceDetailsController_1 = require("./controllers/serviceDetail/ListServiceDetailsController");
const UpdateServiceDetailController_1 = require("./controllers/serviceDetail/UpdateServiceDetailController");
const DeleteServiceDetailController_1 = require("./controllers/serviceDetail/DeleteServiceDetailController");
const CreateRatingController_1 = require("./controllers/rating/CreateRatingController");
const DetailRatingController_1 = require("./controllers/rating/DetailRatingController");
const CreateCommentController_1 = require("./controllers/comment/CreateCommentController");
const ListCommentsController_1 = require("./controllers/comment/ListCommentsController");
const UpdateCommentController_1 = require("./controllers/comment/UpdateCommentController");
const DeleteCommentController_1 = require("./controllers/comment/DeleteCommentController");
const CreateSubcommentController_1 = require("./controllers/subcomment/CreateSubcommentController");
const ListSubcommentsController_1 = require("./controllers/subcomment/ListSubcommentsController");
const UpdateSubcommentController_1 = require("./controllers/subcomment/UpdateSubcommentController");
const DeleteSubcommentController_1 = require("./controllers/subcomment/DeleteSubcommentController");
const ListSubcategoriesByCategoryController_1 = require("./controllers/subcategoires/ListSubcategoriesByCategoryController");
const ListServicesBySubcategoryController_1 = require("./controllers/subcategoires/ListServicesBySubcategoryController");
const ListUserAllController_1 = require("./controllers/user/ListUserAllController");
const CategoriesCarroselController_1 = require("./controllers/category/CategoriesCarroselController");
const isAuthenticated_1 = require("./middlewares/isAuthenticated");
const isAdminOrSupport_1 = require("./middlewares/isAdminOrSupport");
const multer_2 = __importDefault(require("./config/multer"));
const router = (0, express_1.Router)();
exports.router = router;
const upload = (0, multer_1.default)(multer_2.default.upload());
// == Rotas de Usuários ==
router.post("/users", new CreateUserController_1.CreateUserController().handle);
router.post("/createrole", isAuthenticated_1.isAuthenticated, new CreateRoleController_1.CreateRoleController().handle);
router.get("/role/:role", isAuthenticated_1.isAuthenticated, new GetUsersByRoleController_1.GetUsersByRoleController().handle);
router.get("/detailuser", isAuthenticated_1.isAuthenticated, new DetailUserController_1.DetailUserController().handle);
router.get("/listdetailuser", isAuthenticated_1.isAuthenticated, new ListUserAllController_1.ListUserAllController().handle);
router.get("/users/provider-await", isAuthenticated_1.isAuthenticated, isAdminOrSupport_1.isAdminOrSupport, new ListProviderAwaitController_1.ListProviderAwaitController().handle);
router.put("/users/:userId/approve-provider", isAuthenticated_1.isAuthenticated, isAdminOrSupport_1.isAdminOrSupport, new ApproveProviderController_1.ApproveProviderController().handle);
router.put("/users/:userId", isAuthenticated_1.isAuthenticated, new UpdateUserController_1.UpdateUserController().handle);
router.delete("/users/:userId", isAuthenticated_1.isAuthenticated, new DeleteUserController_1.DeleteUserController().handle);
// == Rotas de Sessões ==
router.post("/session", new AuthUserController_1.AuthUserController().handle);
// == Rotas de Categorias ==
router.post("/categories", isAuthenticated_1.isAuthenticated, isAdminOrSupport_1.isAdminOrSupport, upload.single("file"), new CreateCategoryController_1.CreateCategoryController().handle);
router.get("/categories", new ListCategoriesController_1.ListCategoriesController().handle);
router.get("/categories/:categoryId", new DetailCategoryController_1.DetailsCategoryController().handle);
router.get("/categories/name/:name", new GetCategoryByNameController_1.GetCategoryByNameController().handle);
router.put("/categories/:categoryId", isAuthenticated_1.isAuthenticated, isAdminOrSupport_1.isAdminOrSupport, upload.single("file"), new UpdateCategoryController_1.UpdateCategoryController().handle);
router.get("/categoriescarrossel", new CategoriesCarroselController_1.ListCategoriesCarrosselController().handle);
router.delete("/categories/:categoryId", isAuthenticated_1.isAuthenticated, isAdminOrSupport_1.isAdminOrSupport, new DeleteCategoryController_1.DeleteCategoryController().handle);
// == Rotas de Subcategorias ==
router.post("/subcategories", isAuthenticated_1.isAuthenticated, isAdminOrSupport_1.isAdminOrSupport, new CreateSubcategoryController_1.CreateSubcategoryController().handle);
router.put("/subcategories/:subcategoryId", isAuthenticated_1.isAuthenticated, isAdminOrSupport_1.isAdminOrSupport, new UpdateSubcategoryController_1.UpdateSubcategoryController().handle);
router.delete("/subcategories/:subcategoryId", isAuthenticated_1.isAuthenticated, isAdminOrSupport_1.isAdminOrSupport, new DeleteSubcategoryController_1.DeleteSubcategoryController().handle);
router.get("/subcategories", new ListAllSubcategoriesController_1.ListAllSubcategoriesController().handle);
router.get("/subcategories/:subcategoryId", new ListSubcategoriesByIdController_1.ListSubcategoriesByIdController().handle);
router.get("/subcategories/name/:name", new ListSubcategoriesByNameController_1.ListSubcategoriesByNameController().handle);
router.get("/subcategories/category/:categoryId", new ListSubcategoriesByCategoryController_1.ListSubcategoriesByCategoryController().handle);
// == Rotas de Serviços ==
router.post("/services", isAuthenticated_1.isAuthenticated, new CreateServController_1.CreateServiceController().handle);
router.put("/services/:serviceId", isAuthenticated_1.isAuthenticated, new UpdateServiceController_1.UpdateServiceController().handle);
router.delete("/services/:serviceId", isAuthenticated_1.isAuthenticated, new DeleteServiceController_1.DeleteServiceController().handle);
router.get("/services/:serviceId", new DetailServController_1.GetServiceController().handle);
router.get("/allservices", new ListAllServicesController_1.ListAllServicesController().handle);
router.get("/services/category/:categoryId", new ListServicesByCategoryController_1.ListServicesByCategoryController().handle);
// == Rotas de Detalhes de Serviços ==
router.post("/services/details", isAuthenticated_1.isAuthenticated, upload.array("file", 10), new CreateSDController_1.CreateServiceDetailController().handle);
router.put("/services/:serviceId/details", isAuthenticated_1.isAuthenticated, upload.array("file", 10), new UpdateServiceDetailController_1.UpdateServiceDetailController().handle);
router.delete("/services/:serviceId/details/:detailId", isAuthenticated_1.isAuthenticated, new DeleteServiceDetailController_1.DeleteServiceDetailController().handle);
router.get("/services/details/:serviceId", new DetailSDController_1.GetServiceDetailController().handle);
router.get("/services/:serviceId/details", new ListServiceDetailsController_1.ListServiceDetailsController().handle);
// == Rotas de Avaliações ==
router.post("/ratings", isAuthenticated_1.isAuthenticated, new CreateRatingController_1.CreateRatingController().handle);
router.get("/ratings/:serviceId", isAuthenticated_1.isAuthenticated, new DetailRatingController_1.DetailRatingController().handle);
// == Rotas de Comentários ==
router.post("/comments", isAuthenticated_1.isAuthenticated, new CreateCommentController_1.CreateCommentController().handle);
router.get("/comments/:serviceId", isAuthenticated_1.isAuthenticated, new ListCommentsController_1.ListCommentsController().handle);
router.put("/comments/:commentId", isAuthenticated_1.isAuthenticated, new UpdateCommentController_1.UpdateCommentController().handle);
router.delete("/comments/:commentId", isAuthenticated_1.isAuthenticated, new DeleteCommentController_1.DeleteCommentController().handle);
// == Rotas de Subcomentários ==
router.post("/comments/:commentId/subcomments", isAuthenticated_1.isAuthenticated, new CreateSubcommentController_1.CreateSubcommentController().handle);
router.get("/comments/:commentId/subcomments", isAuthenticated_1.isAuthenticated, new ListSubcommentsController_1.ListSubcommentsController().handle);
router.put("/subcomments/:subcommentId", isAuthenticated_1.isAuthenticated, new UpdateSubcommentController_1.UpdateSubcommentController().handle);
router.delete("/subcomments/:subcommentId", isAuthenticated_1.isAuthenticated, new DeleteSubcommentController_1.DeleteSubcommentController().handle);
// == Nova Rota para Serviços por Subcategoria ==
router.get("/services/subcategory/:subcategoryId", new ListServicesBySubcategoryController_1.ListServicesBySubcategoryController().handle);
