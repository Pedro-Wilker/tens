import prismaClient from "../../prisma";

class GetServiceDetailService {
  async execute(serviceId: number) {
    if (!serviceId) {
      throw new Error("Service ID is required");
    }

    const serviceExists = await prismaClient.service.findUnique({
      where: { id: serviceId },
    });

    if (!serviceExists) {
      throw new Error("Service not found");
    }

    const serviceDetails = await prismaClient.serviceDetail.findMany({
      where: {
        serviceId,
      },
      select: {
        id: true,
        photoUrl: true,
        description: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (serviceDetails.length === 0) throw new Error("No service details found for this service");

    return serviceDetails.map((detail) => ({
      ...detail,
      photoUrl: detail.photoUrl, 
    }));
  }
}

export { GetServiceDetailService };