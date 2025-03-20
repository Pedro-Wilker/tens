import prismaClient from "../../prisma";

const isProduction = process.env.NODE_ENV === "production";

class DetailServiceService {
  async execute(serviceId: number) {
    if (!serviceId) {
      throw new Error("Service ID is required");
    }

    const service = await prismaClient.service.findUnique({
      where: { id: serviceId },
      select: {
        id: true,
        name: true,
        description: true,
        price: true,
        provider: {
          select: {
            id: true,
            name: true,
            number: true,
            email: true,
            analfabeto: true,
          },
        },
        subcategory: {
          select: {
            id: true,
            name: true,
          },
        },
        serviceDetails: {
          select: {
            id: true,
            photoUrl: true,
            description: true,
            createdAt: true,
            updatedAt: true,
          },
        },
        comments: {
          select: {
            id: true,
            text: true,
            user: {
              select: { id: true, name: true },
            },
            createdAt: true,
            subcomments: {
              select: {
                id: true,
                text: true,
                createdAt: true,
                user: { select: { id: true, name: true } },
              },
              orderBy: { createdAt: "desc" },
            },
          },
          orderBy: { createdAt: "desc" },
        },
        ratings: {
          select: {
            id: true,
            rating: true,
            user: {
              select: { id: true, name: true },
            },
            createdAt: true,
          },
        },
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!service) {
      throw new Error("Service not found");
    }

    const adjustedService = {
      ...service,
      serviceDetails: service.serviceDetails.map((detail) => {
        let cleanPhotoUrl = detail.photoUrl || "";
        if (cleanPhotoUrl.startsWith("/uploads/")) {
          cleanPhotoUrl = cleanPhotoUrl.replace("/uploads/", "");
        }
        return {
          ...detail,
          photoUrl: `/uploads/${cleanPhotoUrl}`.replace("//", "/"),
        };
      }),
      serviceAverageRating:
        service.ratings.length > 0
          ? service.ratings.reduce((sum, r) => sum + r.rating, 0) / service.ratings.length
          : 0,
    };

    return adjustedService;
  }
}

export { DetailServiceService };