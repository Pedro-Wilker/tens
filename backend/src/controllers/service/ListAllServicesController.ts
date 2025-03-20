import { Request, Response } from 'express';
import { ListAllServicesService } from '../../services/service/ListAllServicesService';

class ListAllServicesController {
  async handle(req: Request, res: Response) {
    const listAllServicesService = new ListAllServicesService();
    try {
      const services = await listAllServicesService.execute();
      return res.json(services);
    } catch (error) {
      return res.status(500).json({ error: 'An unexpected error occurred' });
    }
  }
}

export { ListAllServicesController };