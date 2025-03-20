import { Request, Response } from "express";
import { UpdateServiceService } from "../../services/service/UpdateServiceService";

class UpdateServiceController {
  async handle(req: Request, res: Response) {
    const { serviceId } = req.params;
    const { name, description, price, subcategoryId } = req.body;

    try {
      const updateServiceService = new UpdateServiceService();
      const updatedService = await updateServiceService.execute({
        serviceId:Number(serviceId),
        name,
        description,
        price,
        subcategoryId:Number(subcategoryId),
      });
      return res.status(200).json(updatedService);
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }
}

export { UpdateServiceController };