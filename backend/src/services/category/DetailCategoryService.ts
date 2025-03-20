import prismaClient from "../../prisma";

class DetailsCategoryService {
  async execute(categoryId: number) {
    
    if (!categoryId) {
      throw new Error("Invalid category ID");
    }

    const category = await prismaClient.category.findUnique({
      where: {
        id: categoryId,
      },
      select: {
        id: true,
        name: true,
        imageUrl: true,
        createdAt: true,
        updatedAt: true,
        subcategories: {
          select: {
            id: true,
            name: true,
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
                _count: {
                  select: { ratings: true },
                },
                ratings: {
                  select: {
                    rating: true,
                  },
                },
                serviceDetails: {
                  select: {
                    id: true,
                    photoUrl: true,
                    description: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!category) {
      throw new Error("Category not found");
    }

    const processedSubcategories = category.subcategories.map((subcategory) => {
      const services = subcategory.services.map((service) => {
        const totalRatings = service.ratings.length;
        const sumRatings = service.ratings.reduce((sum, rating) => sum + rating.rating, 0);
        const averageRating = totalRatings > 0 ? sumRatings / totalRatings : 0;

        return {
          ...service,
          averageRating: parseFloat(averageRating.toFixed(2)),
        };
      });

      return {
        ...subcategory,
        services: services.sort((a, b) => b.averageRating - a.averageRating),
      };
    });

    return {
      id: category.id,
      name: category.name,
      imageUrl: category.imageUrl || null,
      createdAt: category.createdAt,
      updatedAt: category.updatedAt,
      subcategories: processedSubcategories,
    };
  }
}

export { DetailsCategoryService };  