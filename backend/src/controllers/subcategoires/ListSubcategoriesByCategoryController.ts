import { Request, Response } from "express";
import { ListSubcategoriesByCategoryService } from "../../services/subcategoires/ListSubcategoriesByCategoryService";

class ListSubcategoriesByCategoryController {
  async handle(req: Request, res: Response) {
    const { categoryId } = req.params;

    try {
      const listSubcategoriesByCategoryService = new ListSubcategoriesByCategoryService();
      const subcategories = await listSubcategoriesByCategoryService.execute(Number(categoryId));
      return res.status(200).json(subcategories);
    } catch (error) {
      return res.status(404).json({ error: error.message });
    }
  }
}

export { ListSubcategoriesByCategoryController };