import prismaClient from "../../prisma";

class ListSubcategoriesByCategoryService {
  async execute(categoryId: number) {
    const categoryExists = await prismaClient.category.findUnique({
      where: {
        id: categoryId,
      },
    });

    if (!categoryExists) {
      throw new Error("Category not found");
    }

    const subcategories = await prismaClient.subcategory.findMany({
      where: {
        categoryId,
      },
      select: {
        id: true,
        name: true,
      },
    });

    return subcategories;
  }
}

export { ListSubcategoriesByCategoryService };