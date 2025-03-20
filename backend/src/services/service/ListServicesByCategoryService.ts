import prismaClient from "../../prisma";

class ListServicesByCategoryService {
  async execute(categoryId: number) {
    const categoryExists = await prismaClient.category.findUnique({
      where: { id: categoryId },
    });

    if (!categoryExists) {
      throw new Error("Category not found");
    }

    const services = await prismaClient.service.findMany({
      where: {
        subcategory: { categoryId: categoryId },
      },
      select: {
        id: true,
        name: true,
        description: true,
        price: true,
        provider: { select: { id: true, name: true } },
        subcategory: { select: { id: true, name: true } },
        createdAt: true,
        updatedAt: true,
        serviceDetails: { select: { id: true, photoUrl: true, description: true } },
        comments: { select: { id: true, text: true, user: { select: { id: true, name: true } }, createdAt: true } },
        ratings: { select: { id: true, rating: true, user: { select: { id: true, name: true } }, createdAt: true } },
        _count: { select: { ratings: true } },
      },
    });

    const sortedServices = services
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
            if (cleanPhotoUrl.startsWith("/public/images/")) {
              cleanPhotoUrl = cleanPhotoUrl.replace("/public/images/", "");
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

    return sortedServices;
  }
}

export { ListServicesByCategoryService };