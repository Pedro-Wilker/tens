import { Request, Response } from "express";
import { ListSubcategoriesByIdService } from "../../services/subcategoires/ListSubcategoriesByIdService";

class ListSubcategoriesByIdController {
  async handle(req: Request, res: Response) {
    const { subcategoryId } = req.params;

    try {
      const listSubcategoriesByIdService = new ListSubcategoriesByIdService();
      const subcategory = await listSubcategoriesByIdService.execute(Number(subcategoryId));
      return res.status(200).json(subcategory);
    } catch (error) {
      return res.status(404).json({ error: error.message }); 
    }
  }
}

export { ListSubcategoriesByIdController };