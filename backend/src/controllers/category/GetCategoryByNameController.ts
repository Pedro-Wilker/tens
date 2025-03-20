import { Request, Response } from 'express';
import { GetCategoryByNameService } from '../../services/category/GetCategoryByNameService';

class GetCategoryByNameController {
  async handle(req: Request, res: Response) {
    const { name } = req.params; 

    try {
      const getCategoryByNameService = new GetCategoryByNameService();
      const category = await getCategoryByNameService.execute(name);
      return res.status(200).json(category);
    } catch (error) {
      return res.status(404).json({ error: error.message }); 
    }
  }
}

export { GetCategoryByNameController };