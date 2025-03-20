import { Request, Response } from 'express';
import { ListServiceDetailsService } from '../../services/serviceDetail/ListServiceDetailsService';

class ListServiceDetailsController {
  async handle(req: Request, res: Response) {
    const { serviceId } = req.params;
    const listServiceDetailsService = new ListServiceDetailsService();
    try {
      const serviceDetails = await listServiceDetailsService.execute(Number(serviceId));
      return res.json(serviceDetails);
    } catch (error) {
      return res.status(404).json({ error: error.message });
    }
  }
}

export { ListServiceDetailsController };