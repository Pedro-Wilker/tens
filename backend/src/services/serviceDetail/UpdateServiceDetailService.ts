import prismaClient from "../../prisma";
import fs from "fs";
import path from "path";

interface PhotoDetail {
  file?: Express.Multer.File;
  description?: string;
}

interface ServiceDetailRequest {
  serviceId: number;
  photoDetails: PhotoDetail[];
}

const isProduction = process.env.NODE_ENV === "production";
const uploadDir = process.env.UPLOAD_DIR || (isProduction ? "/public_html/uploads" : path.join(process.cwd(), "uploads"));

class UpdateServiceDetailService {
  async execute({ serviceId, photoDetails }: ServiceDetailRequest) {
    if (!serviceId) {
      throw new Error("Service ID is required");
    }

    if (!photoDetails || photoDetails.length === 0) {
      throw new Error("At least one photo detail is required");
    }

    const serviceExists = await prismaClient.service.findUnique({
      where: { id: serviceId },
    });

    if (!serviceExists) {
      throw new Error("Service not found");
    }

    const existingDetails = await prismaClient.serviceDetail.findMany({
      where: { serviceId },
    });

    for (const detail of existingDetails) {
      const oldImagePath = path.join(uploadDir, detail.photoUrl);
      if (fs.existsSync(oldImagePath)) {
        fs.unlinkSync(oldImagePath);
      }
    }

    await prismaClient.serviceDetail.deleteMany({
      where: { serviceId },
    });

    const updatedDetails = await Promise.all(
      photoDetails
        .filter((photo) => photo.file)
        .map((photo) =>
          prismaClient.serviceDetail.create({
            data: {
              serviceId,
              photoUrl: photo.file!.filename,
              description: photo.description,
            },
          })
        )
    );

    return updatedDetails.map((detail) => ({
      id: detail.id,
      photoUrl: `/uploads/${detail.photoUrl}`.replace("//", "/"),
      description: detail.description,
      createdAt: detail.createdAt,
      updatedAt: detail.updatedAt,
    }));
  }
}

export { UpdateServiceDetailService };