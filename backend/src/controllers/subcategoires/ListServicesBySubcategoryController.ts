import { Request, Response } from "express";
import { ListServicesBySubcategoryService } from "../../services/subcategoires/ListServicesBySubcategoryService";

class ListServicesBySubcategoryController {
  async handle(req: Request, res: Response) {
    const { subcategoryId } = req.params;

    try {
      const listServicesBySubcategoryService = new ListServicesBySubcategoryService();
      const services = await listServicesBySubcategoryService.execute(Number(subcategoryId));
      return res.status(200).json(services);
    } catch (error) {
      return res.status(404).json({ error: error.message });
    }
  }
}

export { ListServicesBySubcategoryController };