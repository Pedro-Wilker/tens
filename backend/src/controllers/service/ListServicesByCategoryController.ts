import { Request, Response } from 'express';
import { ListServicesByCategoryService } from '../../services/service/ListServicesByCategoryService';

class ListServicesByCategoryController {
  async handle(req: Request, res: Response) {
    const { categoryId } = req.params;
    const listServicesByCategoryService = new ListServicesByCategoryService();
    try {
      const services = await listServicesByCategoryService.execute(Number(categoryId));
      return res.json(services);
    } catch (error) {
      if (error.message === 'Category not found') {
        return res.status(404).json({ error: error.message });
      }
      return res.status(500).json({ error: 'An unexpected error occurred' });
    }
  }
}

export { ListServicesByCategoryController };