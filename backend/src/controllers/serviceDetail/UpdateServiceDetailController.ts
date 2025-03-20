import { Request, Response } from "express";
import { UpdateServiceDetailService } from "../../services/serviceDetail/UpdateServiceDetailService";

class UpdateServiceDetailController {
  async handle(req: Request, res: Response) {
    const { serviceId } = req.params;
    const files = req.files as Express.Multer.File[] | undefined;
    const description = req.body.description || "";

    if (!serviceId) {
      return res.status(400).json({ error: "Service ID is required" });
    }

    const updateServiceDetailService = new UpdateServiceDetailService();
    try {
      const photoDetails = files
        ? files.map((file) => ({ file, description }))
        : [{ description }];

      const updatedDetails = await updateServiceDetailService.execute({
        serviceId: Number(serviceId),
        photoDetails,
      });

      return res.status(200).json(updatedDetails);
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }
}

export { UpdateServiceDetailController };