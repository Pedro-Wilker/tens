import prismaClient from "../../prisma";
import fs from "fs";
import path from "path";

interface DeleteServiceDetailParams {
  serviceId: number;
  detailId: number;
  userId: string;
}

class DeleteServiceDetailService {
  async execute({ serviceId, detailId, userId }: DeleteServiceDetailParams) {
    if (!serviceId || !detailId) {
      throw new Error("Service ID and Detail ID are required");
    }

    const serviceDetail = await prismaClient.serviceDetail.findUnique({
      where: { id: detailId, serviceId },
      include: { service: { include: { provider: true } } },
    });

    if (!serviceDetail) {
      throw new Error("Service detail not found");
    }

    if (serviceDetail.service.providerId !== Number(userId)) {
      throw new Error("You are not authorized to delete this service detail");
    }

    if (serviceDetail.photoUrl) {
      const uploadDir = path.resolve(__dirname, "..", "..", "uploads");
      const fileName = serviceDetail.photoUrl.split("/").pop() || serviceDetail.photoUrl;
      const imagePath = path.join(uploadDir, fileName);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    await prismaClient.serviceDetail.delete({
      where: { id: detailId },
    });
  }
}

export { DeleteServiceDetailService };