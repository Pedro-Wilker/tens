import { Request, Response } from "express";
import { ListCategoriesService } from "../../services/category/ListCategoriesService";

class ListCategoriesController {
  async handle(req: Request, res: Response) {
    try {
      const listCategoriesService = new ListCategoriesService();
      const categories = await listCategoriesService.execute();
      return res.status(200).json(categories);
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }
}

export { ListCategoriesController };