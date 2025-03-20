import { Request, Response } from "express";
import { DeleteSubcategoryService } from "../../services/subcategoires/DeleteSubcategoryService";

class DeleteSubcategoryController {
  async handle(req: Request, res: Response) {
    const { subcategoryId } = req.params;

    try {
      const deleteSubcategoryService = new DeleteSubcategoryService();
      const result = await deleteSubcategoryService.execute(Number(subcategoryId));
      return res.status(200).json(result);
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }
}

export { DeleteSubcategoryController };