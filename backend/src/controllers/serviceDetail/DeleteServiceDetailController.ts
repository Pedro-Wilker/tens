import { Request, Response } from "express";
import { DeleteServiceDetailService } from "../../services/serviceDetail/DeleteServiceDetailService";

class DeleteServiceDetailController {
  async handle(req: Request, res: Response) {
    const { serviceId, detailId } = req.params;
    const userId = req.user_id; 

    try {
      const deleteServiceDetailService = new DeleteServiceDetailService();
      await deleteServiceDetailService.execute({
        serviceId: Number(serviceId),
        detailId: Number(detailId),
        userId,
      });
      return res.status(204).send();
    } catch (error) {
      console.error("Erro no DeleteServiceDetailController:", error);
      return res.status(400).json({ error: error.message });
    }
  }
}

export { DeleteServiceDetailController };