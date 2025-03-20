import prismaClient from "../../prisma";

interface PhotoDetail {
  file: Express.Multer.File;
  description?: string;
}

interface ServiceDetailRequest {
  serviceId: number;
  photoDetails: PhotoDetail[];
}

const isProduction = process.env.NODE_ENV === "production";

class CreateServiceDetailService {
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

    const createdDetails = await Promise.all(
      photoDetails.map((photo) =>
        prismaClient.serviceDetail.create({
          data: {
            serviceId,
            photoUrl: photo.file.filename, 
            description: photo.description,
          },
        })
      )
    );

    const prefix = isProduction ? "/uploads/" : "/uploads/";
    const adjustedDetails = createdDetails.map((detail) => ({
      id: detail.id,
      photoUrl: `${prefix}${detail.photoUrl}`.replace("//", "/"), 
      description: detail.description,
      createdAt: detail.createdAt,
      updatedAt: detail.updatedAt,
    }));

    return adjustedDetails;
  }
}

export { CreateServiceDetailService };