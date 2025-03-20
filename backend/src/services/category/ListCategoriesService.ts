import prismaClient from "../../prisma";

class ListCategoriesService {
  async execute() {
    const categories = await prismaClient.category.findMany({
      select: {
        id: true,
        name: true,
        imageUrl: true,
        subcategories: {
          select: {
            id: true,
            name: true,
            services: {
              select: {
                id: true,
                name: true,
                description: true,
                price: true,
                provider: {
                  select: { id: true, name: true },
                },
                subcategory: {
                  select: { id: true, name: true },
                },
                createdAt: true,
                updatedAt: true,
                serviceDetails: {
                  select: { id: true, photoUrl: true, description: true },
                },
                ratings: {
                  select: { id: true, rating: true, user: { select: { id: true, name: true } }, createdAt: true },
                },
                comments: {
                  select: { id: true, text: true, user: { select: { id: true, name: true } }, createdAt: true },
                },
              },
            },
          },
        },
      },
    });

    const transformedCategories = categories.map((category) => {
      const processedSubcategories = category.subcategories.map((subcategory) => {
        const processedServices = subcategory.services.map((service) => {
          const totalRatings = service.ratings.length;
          const sumRatings = service.ratings.reduce((sum, rating) => sum + rating.rating, 0);
          const averageRating = totalRatings > 0 ? sumRatings / totalRatings : 0;

          return {
            ...service,
            serviceDetails: service.serviceDetails.map((detail) => ({
              ...detail,
              photoUrl: detail.photoUrl, 
            })),
            averageRating: parseFloat(averageRating.toFixed(2)),
          };
        });

        return {
          ...subcategory,
          services: processedServices.sort((a, b) => b.averageRating - a.averageRating),
        };
      });

      return {
        id: category.id,
        name: category.name,
        imageUrl: category.imageUrl || null,
        subcategories: processedSubcategories,
      };
    });

    return transformedCategories.filter((category) => category.imageUrl !== null);
  }
}

export { ListCategoriesService };