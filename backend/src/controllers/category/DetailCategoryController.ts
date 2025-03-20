import { Request, Response } from "express";
import { DetailsCategoryService } from "../../services/category/DetailCategoryService";

class DetailsCategoryController {
  async handle(req: Request, res: Response) {
    const { categoryId } = req.params; 
    
    if (!categoryId) {
      return res.status(400).json({ error: "Invalid category ID" });
    }

    try {
      const detailsCategoryService = new DetailsCategoryService();
      const category = await detailsCategoryService.execute(Number(categoryId));
      return res.status(200).json(category);
    } catch (error) {
  
      if (error.message === "Category not found") {
        return res.status(404).json({ error: error.message });
      }
      return res.status(500).json({ error: "Internal server error" });
    }
  }
}

export { DetailsCategoryController };