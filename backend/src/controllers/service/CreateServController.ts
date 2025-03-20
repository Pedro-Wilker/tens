import { Request, Response } from 'express';
import { CreateServiceService } from '../../services/service/CreateServService';

class CreateServiceController {
  async handle(req: Request, res: Response) {
    const { providerId, subcategoryId, name, description, price } = req.body;
    const createServiceService = new CreateServiceService();
    try {
      const service = await createServiceService.execute({ providerId:Number(providerId), subcategoryId:Number(subcategoryId), name, description, price });
      return res.status(201).json(service);
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }
}

export { CreateServiceController };