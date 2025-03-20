import { Request, Response } from "express";
import { ListSubcategoriesByNameService } from "../../services/subcategoires/ListSubcategoriesByNameService";

class ListSubcategoriesByNameController {
  async handle(req: Request, res: Response) {
    const { name } = req.params;

    try {
      const listSubcategoriesByNameService = new ListSubcategoriesByNameService();
      const subcategories = await listSubcategoriesByNameService.execute(name);
      return res.status(200).json(subcategories);
    } catch (error) {
      return res.status(404).json({ error: error.message }); 
    }
  }
}

export { ListSubcategoriesByNameController };