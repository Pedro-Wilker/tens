import { Request, Response } from "express";
import { CreateSubcategoryService } from "../../services/subcategoires/CreateSubcategoryService"; 

class CreateSubcategoryController {
  async handle(req: Request, res: Response) {
    const { categoryId, name } = req.body;

    try {
      const createSubcategoryService = new CreateSubcategoryService();
      const subcategory = await createSubcategoryService.execute({ categoryId:Number(categoryId), name });
      return res.status(201).json(subcategory); 
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }
}

export { CreateSubcategoryController };