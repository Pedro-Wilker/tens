import { Request, Response } from "express";
import { UpdateSubcategoryService } from "../../services/subcategoires/UpdateSubcategoryService";

class UpdateSubcategoryController {
  async handle(req: Request, res: Response) {
    const { subcategoryId } = req.params;
    const { name } = req.body;

    try {
      const updateSubcategoryService = new UpdateSubcategoryService();
      const updatedSubcategory = await updateSubcategoryService.execute({ subcategoryId: Number(subcategoryId), name });
      return res.status(200).json(updatedSubcategory);
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }
}

export { UpdateSubcategoryController };