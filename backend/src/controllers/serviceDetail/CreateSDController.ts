import { Request, Response } from "express";
import { CreateServiceDetailService } from "../../services/serviceDetail/CreateSDService";
import multerConfig from "../../config/multer";

const upload = multerConfig.upload();

class CreateServiceDetailController {
  async handle(req: Request, res: Response) {
    const { serviceId, description } = req.body;
    const files = req.files as Express.Multer.File[];

    if (!files || files.length === 0) {
      return res.status(400).json({ error: "No files uploaded" });
    }

    const photoDetails = files.map((file) => ({
      file,
      description: description || undefined, 
    }));

    const createServiceDetailService = new CreateServiceDetailService();
    try {
      const serviceDetail = await createServiceDetailService.execute({
        serviceId: Number(serviceId),
        photoDetails,
      });
      return res.status(201).json(serviceDetail);
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }
}

export { CreateServiceDetailController };