import { Request, Response } from "express";
import { DetailServiceService } from "../../services/service/DetailServService";

class GetServiceController {
  async handle(req: Request, res: Response) {
    const { serviceId } = req.params;
    const detailServiceService = new DetailServiceService();

    try {
      const service = await detailServiceService.execute(Number(serviceId));
      return res.json(service);
    } catch (error) {
      return res.status(404).json({ error: error.message });
    }
  }
}

export { GetServiceController };