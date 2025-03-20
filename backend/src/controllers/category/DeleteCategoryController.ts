import { Request, Response } from "express";
import { DeleteCategoryService } from "../../services/category/DeleteCategoryService";

class DeleteCategoryController {
  async handle(req: Request, res: Response) {
    const { categoryId } = req.params; 

    try {
      const deleteCategoryService = new DeleteCategoryService();
      const result = await deleteCategoryService.execute(Number(categoryId));
      return res.status(200).json(result); 
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }
}

export { DeleteCategoryController };