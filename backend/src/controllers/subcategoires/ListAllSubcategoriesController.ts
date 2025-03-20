import { Request, Response } from "express";
import { ListAllSubcategoriesService } from "../../services/subcategoires/ListAllSubcategoriesService"; 

class ListAllSubcategoriesController {
  async handle(req: Request, res: Response) {
    try {
      const listAllSubcategoriesService = new ListAllSubcategoriesService();
      const subcategories = await listAllSubcategoriesService.execute();
      return res.status(200).json(subcategories);
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }
}

export { ListAllSubcategoriesController };