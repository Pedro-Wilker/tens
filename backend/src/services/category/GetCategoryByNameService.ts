import prismaClient from "../../prisma";

class GetCategoryByNameService {
  async execute(name: string) {
    const category = await prismaClient.category.findFirst({
      where: {
        name: {
          contains: name.toLowerCase(), // Busca insensível simulada com toLowerCase
        },
      },
      include: {
        subcategories: {
          include: {
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

    const services = category.subcategories
      .flatMap((sub) => sub.services)
      .map((service) => {
        const totalRatings = service.ratings.length;
        const sumRatings = service.ratings.reduce((sum, rating) => sum + rating.rating, 0);
        const averageRating = totalRatings > 0 ? sumRatings / totalRatings : 0;

        return {
          ...service,
          serviceDetails: service.serviceDetails.map((detail) => {
            let cleanPhotoUrl = detail.photoUrl || "";
            if (!cleanPhotoUrl || cleanPhotoUrl.trim() === "") {
              cleanPhotoUrl = "placeholder.jpg";
            }
            if (cleanPhotoUrl.startsWith("/uploads/")) {
              cleanPhotoUrl = cleanPhotoUrl.replace("/uploads/", "");
            }
            return {
              ...detail,
              photoUrl: `/uploads/${cleanPhotoUrl}`.replace("//", "/"),
            };
          }),
          averageRating: parseFloat(averageRating.toFixed(2)),
        };
      })
      .sort((a, b) => b.averageRating - a.averageRating);

    return {
      id: category.id,
      name: category.name,
      imageUrl: category.imageUrl ? `/uploads/${category.imageUrl}`.replace("//", "/") : "/uploads/placeholder.jpg",
      createdAt: category.createdAt,
      updatedAt: category.updatedAt,
      subcategories: category.subcategories.map((sub) => ({
        id: sub.id,
        name: sub.name,
      })),
      services,
    };
  }
}

export { GetCategoryByNameService };