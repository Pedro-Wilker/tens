import prismaClient from "../../prisma";

class ListAllSubcategoriesService {
  async execute() {
    const subcategories = await prismaClient.subcategory.findMany({
      select: {
        id: true,
        name: true,
        categoryId: true,
        createdAt: true,
        updatedAt: true,
        services: {
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
          },
        },
      },
    });

    const transformedSubcategories = subcategories.map((subcategory) => {
      const processedServices = subcategory.services.map((service) => {
        const totalRatings = service.ratings.length;
        const sumRatings = service.ratings.reduce(
          (sum, rating) => sum + rating.rating,
          0
        );
        const averageRating = totalRatings > 0 ? sumRatings / totalRatings : 0;

        return {
          ...service,
          serviceDetails: service.serviceDetails.map((detail) => ({
            ...detail,
            photoUrl: `/public/images/${detail.photoUrl}`,
          })),
          averageRating: parseFloat(averageRating.toFixed(2)),
        };
      });

      return {
        id: subcategory.id,
        name: subcategory.name,
        categoryId: subcategory.categoryId,
        createdAt: subcategory.createdAt,
        updatedAt: subcategory.updatedAt,
        services: processedServices.sort((a, b) => b.averageRating - a.averageRating),
      };
    });

    return transformedSubcategories;
  }
}

export { ListAllSubcategoriesService };