import prismaClient from "../../prisma";

interface ServiceRequest {
  providerId: number;
  subcategoryId: number;
  name: string;
  description?: string;
  price?: number;
}

class CreateServiceService {
  async execute({ providerId, subcategoryId, name, description, price }: ServiceRequest) {
    if (!providerId || !subcategoryId) {
      throw new Error("Provider ID and Subcategory ID are required");
    }

    if (!name) {
      throw new Error("Service name is required");
    }

    if (price != null && (typeof price !== "number" || isNaN(price) || price < 0)) {
      throw new Error("Price must be a valid non-negative number");
    }

    const providerExists = await prismaClient.user.findUnique({
      where: {
        id: providerId,
      },
    });

    if (!providerExists) {
      throw new Error("Provider not found");
    }

    const subcategoryExists = await prismaClient.subcategory.findUnique({
      where: {
        id: subcategoryId,
      },
    });

    if (!subcategoryExists) {
      throw new Error("Subcategory not found");
    }

    const serviceAlreadyExists = await prismaClient.service.findFirst({
      where: {
        providerId,
        subcategoryId,
        name,
      },
    });

    if (serviceAlreadyExists) {
      throw new Error("Service name already exists for this provider and subcategory");
    }

    const service = await prismaClient.service.create({
      data: {
        providerId,
        subcategoryId,
        name,
        description,
        price: price ?? undefined,
      },
      select: {
        id: true,
        name: true,
        description: true,
        price: true,
        provider: {
          select: {
            id: true,
            name: true,
          },
        },
        subcategory: {
          select: {
            id: true,
            name: true,
          },
        },
        createdAt: true,
        updatedAt: true, 
      },
    });

    return service;
  }
}

export { CreateServiceService };