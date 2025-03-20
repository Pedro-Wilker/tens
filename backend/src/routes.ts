import { Router } from "express";
import multer from "multer";

import { CreateUserController } from "./controllers/user/CreateUserController";
import { AuthUserController } from "./controllers/user/AuthUserController";
import { GetUsersByRoleController } from "./controllers/user/GetUsersByRoleController";
import { DetailUserController } from "./controllers/user/DetailUserController";
import { CreateRoleController } from "./controllers/user/CreateRoleController";
import { ApproveProviderController } from "./controllers/user/ApproveProviderController";
import { ListProviderAwaitController } from "./controllers/user/ListProviderAwaitController";
import { UpdateUserController } from "./controllers/user/UpdateUserController";
import { DeleteUserController } from "./controllers/user/DeleteUserController";
import { CreateCategoryController } from "./controllers/category/CreateCategoryController";
import { DetailsCategoryController } from "./controllers/category/DetailCategoryController";
import { ListCategoriesController } from "./controllers/category/ListCategoriesController";
import { GetCategoryByNameController } from "./controllers/category/GetCategoryByNameController";
import { UpdateCategoryController } from "./controllers/category/UpdateCategoryController";
import { DeleteCategoryController } from "./controllers/category/DeleteCategoryController";
import { CreateSubcategoryController } from "./controllers/subcategoires/CreateSubcategoryController";
import { UpdateSubcategoryController } from "./controllers/subcategoires/UpdateSubcategoryController";
import { DeleteSubcategoryController } from "./controllers/subcategoires/DeleteSubcategoryController";
import { ListAllSubcategoriesController } from "./controllers/subcategoires/ListAllSubcategoriesController";
import { ListSubcategoriesByIdController } from "./controllers/subcategoires/ListSubcategoriesByIdController";
import { ListSubcategoriesByNameController } from "./controllers/subcategoires/ListSubcategoriesByNameController";
import { CreateServiceController } from "./controllers/service/CreateServController";
import { GetServiceController } from "./controllers/service/DetailServController";
import { ListAllServicesController } from "./controllers/service/ListAllServicesController";
import { ListServicesByCategoryController } from "./controllers/service/ListServicesByCategoryController";
import { UpdateServiceController } from "./controllers/service/UpdateServiceController";
import { DeleteServiceController } from "./controllers/service/DeleteServiceController";
import { CreateServiceDetailController } from "./controllers/serviceDetail/CreateSDController";
import { GetServiceDetailController } from "./controllers/serviceDetail/DetailSDController";
import { ListServiceDetailsController } from "./controllers/serviceDetail/ListServiceDetailsController";
import { UpdateServiceDetailController } from "./controllers/serviceDetail/UpdateServiceDetailController";
import { DeleteServiceDetailController } from "./controllers/serviceDetail/DeleteServiceDetailController";
import { CreateRatingController } from "./controllers/rating/CreateRatingController";
import { DetailRatingController } from "./controllers/rating/DetailRatingController";
import { CreateCommentController } from "./controllers/comment/CreateCommentController";
import { ListCommentsController } from "./controllers/comment/ListCommentsController";
import { UpdateCommentController } from "./controllers/comment/UpdateCommentController";
import { DeleteCommentController } from "./controllers/comment/DeleteCommentController";
import { CreateSubcommentController } from "./controllers/subcomment/CreateSubcommentController";
import { ListSubcommentsController } from "./controllers/subcomment/ListSubcommentsController";
import { UpdateSubcommentController } from "./controllers/subcomment/UpdateSubcommentController";
import { DeleteSubcommentController } from "./controllers/subcomment/DeleteSubcommentController";
import { ListSubcategoriesByCategoryController } from "./controllers/subcategoires/ListSubcategoriesByCategoryController";
import { ListServicesBySubcategoryController } from "./controllers/subcategoires/ListServicesBySubcategoryController";
import { ListUserAllController } from "./controllers/user/ListUserAllController";
import { ListCategoriesCarrosselController } from "./controllers/category/CategoriesCarroselController";
import { isAuthenticated } from "./middlewares/isAuthenticated";
import { isAdminOrSupport } from "./middlewares/isAdminOrSupport";
import multerConfig from "./config/multer";

const router = Router();
const upload = multer(multerConfig.upload()); 

// == Rotas de Usuários ==
router.post("/users", new CreateUserController().handle);
router.post("/createrole", isAuthenticated, new CreateRoleController().handle);
router.get("/role/:role", isAuthenticated, new GetUsersByRoleController().handle);
router.get("/detailuser", isAuthenticated, new DetailUserController().handle); 
router.get("/listdetailuser", isAuthenticated, new ListUserAllController().handle);
router.get("/users/provider-await", isAuthenticated, isAdminOrSupport, new ListProviderAwaitController().handle);
router.put("/users/:userId/approve-provider", isAuthenticated, isAdminOrSupport, new ApproveProviderController().handle);
router.put("/users/:userId", isAuthenticated, new UpdateUserController().handle);
router.delete("/users/:userId", isAuthenticated, new DeleteUserController().handle);

// == Rotas de Sessões ==
router.post("/session", new AuthUserController().handle);

// == Rotas de Categorias ==
router.post("/categories", isAuthenticated, isAdminOrSupport, upload.single("file"), new CreateCategoryController().handle);
router.get("/categories", new ListCategoriesController().handle);
router.get("/categories/:categoryId", new DetailsCategoryController().handle);
router.get("/categories/name/:name", new GetCategoryByNameController().handle);
router.put("/categories/:categoryId", isAuthenticated, isAdminOrSupport, upload.single("file"),new UpdateCategoryController().handle);
router.get("/categoriescarrossel", new ListCategoriesCarrosselController().handle);
router.delete("/categories/:categoryId", isAuthenticated, isAdminOrSupport, new DeleteCategoryController().handle);

// == Rotas de Subcategorias ==
router.post("/subcategories", isAuthenticated, isAdminOrSupport, new CreateSubcategoryController().handle);
router.put("/subcategories/:subcategoryId", isAuthenticated, isAdminOrSupport, new UpdateSubcategoryController().handle);
router.delete("/subcategories/:subcategoryId", isAuthenticated, isAdminOrSupport, new DeleteSubcategoryController().handle);
router.get("/subcategories", new ListAllSubcategoriesController().handle);
router.get("/subcategories/:subcategoryId", new ListSubcategoriesByIdController().handle);
router.get("/subcategories/name/:name", new ListSubcategoriesByNameController().handle);
router.get("/subcategories/category/:categoryId", new ListSubcategoriesByCategoryController().handle); 

// == Rotas de Serviços ==
router.post("/services", isAuthenticated, new CreateServiceController().handle);
router.put("/services/:serviceId", isAuthenticated, new UpdateServiceController().handle);
router.delete("/services/:serviceId", isAuthenticated, new DeleteServiceController().handle);
router.get("/services/:serviceId", new GetServiceController().handle);
router.get("/allservices", new ListAllServicesController().handle);
router.get("/services/category/:categoryId", new ListServicesByCategoryController().handle); 

// == Rotas de Detalhes de Serviços ==
router.post("/services/details", isAuthenticated, upload.array("file", 10), new CreateServiceDetailController().handle);
router.put("/services/:serviceId/details", isAuthenticated, upload.array("file", 10), new UpdateServiceDetailController().handle);
router.delete("/services/:serviceId/details/:detailId", isAuthenticated, new DeleteServiceDetailController().handle);
router.get("/services/details/:serviceId", new GetServiceDetailController().handle); 
router.get("/services/:serviceId/details", new ListServiceDetailsController().handle);

// == Rotas de Avaliações ==
router.post("/ratings", isAuthenticated, new CreateRatingController().handle);
router.get("/ratings/:serviceId", isAuthenticated, new DetailRatingController().handle);

// == Rotas de Comentários ==
router.post("/comments", isAuthenticated, new CreateCommentController().handle);
router.get("/comments/:serviceId", isAuthenticated, new ListCommentsController().handle);
router.put("/comments/:commentId", isAuthenticated, new UpdateCommentController().handle);
router.delete("/comments/:commentId", isAuthenticated, new DeleteCommentController().handle);

// == Rotas de Subcomentários ==
router.post("/comments/:commentId/subcomments", isAuthenticated, new CreateSubcommentController().handle);
router.get("/comments/:commentId/subcomments", isAuthenticated, new ListSubcommentsController().handle);
router.put("/subcomments/:subcommentId", isAuthenticated, new UpdateSubcommentController().handle);
router.delete("/subcomments/:subcommentId", isAuthenticated, new DeleteSubcommentController().handle);

// == Nova Rota para Serviços por Subcategoria ==
router.get("/services/subcategory/:subcategoryId", new ListServicesBySubcategoryController().handle);

export { router };