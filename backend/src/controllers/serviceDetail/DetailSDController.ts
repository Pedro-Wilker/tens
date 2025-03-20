import { Request, Response } from 'express'; 
import { GetServiceDetailService } from '../../services/serviceDetail/DetailSDService';

class GetServiceDetailController {
  async handle(req: Request, res: Response) {
    const { serviceId } = req.params;
    const getServiceDetailService = new GetServiceDetailService();
    try {
      const serviceDetails = await getServiceDetailService.execute(Number(serviceId));
      return res.json(serviceDetails);
    } catch (error) {
      return res.status(404).json({ error: error.message });
    }
  }
}

export { GetServiceDetailController };
