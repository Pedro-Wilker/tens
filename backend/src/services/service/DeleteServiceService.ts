import prismaClient from "../../prisma";
import fs from "fs";
import path from "path";

interface DeleteServiceParams {
  serviceId: number;
  userId: string; 
}

class DeleteServiceService {
  async execute({ serviceId, userId }: DeleteServiceParams) {
    if (!serviceId) {
      throw new Error("Service ID is required");
    }

    const service = await prismaClient.service.findUnique({
      where: { id: serviceId },
      include: { provider: true, serviceDetails: true, ratings: true, comments: true },
    });

    if (!service) {
      throw new Error("Service not found");
    }

    if (service.providerId !== Number(userId)) {
      throw new Error("You are not authorized to delete this service");
    }

    const uploadDir = path.resolve(__dirname, "..", "..", "uploads");
    if (service.serviceDetails.length > 0) {
      for (const detail of service.serviceDetails) {
        if (detail.photoUrl) {
          const fileName = detail.photoUrl.split("/").pop() || detail.photoUrl;
          const imagePath = path.join(uploadDir, fileName);
          if (fs.existsSync(imagePath)) {
            fs.unlinkSync(imagePath);
          }
        }
      }
    }

    await prismaClient.$transaction([
      prismaClient.serviceDetail.deleteMany({ where: { serviceId } }),
      prismaClient.rating.deleteMany({ where: { serviceId } }),
      prismaClient.comment.deleteMany({ where: { serviceId } }),
      prismaClient.service.delete({ where: { id: serviceId } }),
    ]);
  }
}

export { DeleteServiceService };