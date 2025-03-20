import { Request, Response } from "express";
import { UpdateCategoryService } from "../../services/category/UpdateCategoryService";

class UpdateCategoryController {
  async handle(req: Request, res: Response) {
    const { categoryId } = req.params;
    const { name } = req.body;
    const file = req.file;

    try {
      const updateCategoryService = new UpdateCategoryService();
      const updatedCategory = await updateCategoryService.execute({
        id: Number(categoryId),
        name: name || undefined,
        file,
      });
      return res.status(200).json(updatedCategory);
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }
}

export { UpdateCategoryController };