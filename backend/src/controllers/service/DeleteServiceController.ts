import { Request, Response } from "express";
import { DeleteServiceService } from "../../services/service/DeleteServiceService";

class DeleteServiceController {
  async handle(req: Request, res: Response) {
    const { serviceId } = req.params;
    const userId = req.user_id; 

    try {
      const deleteServiceService = new DeleteServiceService();
      await deleteServiceService.execute({
        serviceId: Number(serviceId),
        userId,
      });
      return res.status(204).send(); 
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }
}

export { DeleteServiceController };