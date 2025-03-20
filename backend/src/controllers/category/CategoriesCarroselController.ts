import { Request, Response } from "express";
import { ListCategoriesCarrosselService } from "../../services/category/CategoriesCarroselService";

class ListCategoriesCarrosselController {
  async handle(req: Request, res: Response) {
    const listCategoriesCarrosselService = new ListCategoriesCarrosselService();
    const categories = await listCategoriesCarrosselService.execute();
    return res.status(200).json(categories);
  }
}

export { ListCategoriesCarrosselController };