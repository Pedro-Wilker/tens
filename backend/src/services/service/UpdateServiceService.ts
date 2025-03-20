import prismaClient from "../../prisma";

interface ServiceRequest {
  serviceId: number;
  name?: string;
  description?: string; 
  price?: number; 
  subcategoryId?: number; 
}

class UpdateServiceService {
  async execute({ serviceId, name, description, price, subcategoryId }: ServiceRequest) {
    if (!serviceId) {
      throw new Error("Service ID is required");
    }

    if (!name && !description && !price && !subcategoryId) {
      throw new Error("At least one field (name, description, price, or subcategoryId) must be provided to update");
    }

    const service = await prismaClient.service.findUnique({
      where: { id: serviceId },
    });

    if (!service) {
      throw new Error("Service not found");
    }

    if (price != null && (typeof price !== "number" || isNaN(price) || price < 0)) {
      throw new Error("Price must be a valid non-negative number");
    }

    if (subcategoryId) {
      const subcategoryExists = await prismaClient.subcategory.findUnique({
        where: { id: subcategoryId },
      });

      if (!subcategoryExists) {
        throw new Error("Subcategory not found");
      }
    }

    if (name && name !== service.name) {
      const serviceAlreadyExists = await prismaClient.service.findFirst({
        where: {
          providerId: service.providerId,
          subcategoryId: subcategoryId || service.subcategoryId, 
          name,
        },
      });

      if (serviceAlreadyExists) {
        throw new Error("Service name already exists for this provider and subcategory");
      }
    }

    const updateData: {
      name?: string;
      description?: string;
      price?: number;
      subcategoryId?: number;
    } = {};

    if (name) updateData.name = name;
    if (description) updateData.description = description;
    if (price != null) updateData.price = price; 
    if (subcategoryId) updateData.subcategoryId = subcategoryId;

    const updatedService = await prismaClient.service.update({
      where: { id: serviceId },
      data: updateData,
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
        serviceDetails: {
          select: {
            id: true,
            photoUrl: true,
            description: true,
          },
        },
        comments: {
          select: {
            id: true,
            text: true,
            user: {
              select: {
                id: true,
                name: true,
              },
            },
            createdAt: true,
          },
        },
        ratings: {
          select: {
            id: true,
            rating: true,
            user: {
              select: {
                id: true,
                name: true,
              },
            },
            createdAt: true,
          },
        },
      },
    });

    const totalRatings = updatedService.ratings.length;
    const sumRatings = updatedService.ratings.reduce((sum, rating) => sum + rating.rating, 0);
    const averageRating = totalRatings > 0 ? sumRatings / totalRatings : 0;

    return {
      ...updatedService,
      serviceDetails: updatedService.serviceDetails.map((detail) => ({
        ...detail,
        photoUrl: `/public/images/${detail.photoUrl}`,
      })),
      serviceAverageRating: parseFloat(averageRating.toFixed(2)),
    };
  }
}

export { UpdateServiceService };