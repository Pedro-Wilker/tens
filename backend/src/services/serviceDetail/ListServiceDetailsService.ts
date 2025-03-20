import prismaClient from "../../prisma";

class ListServiceDetailsService {
  async execute(serviceId: number) {
    if (!serviceId) {
      throw new Error("Service ID is required");
    }

    const serviceExists = await prismaClient.service.findUnique({
      where: {
        id: serviceId,
      },
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

    return serviceDetails.map((detail) => ({
      ...detail,
      photoUrl: detail.photoUrl, 
    }));
  }
}

export { ListServiceDetailsService };