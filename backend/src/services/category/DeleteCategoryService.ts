import prismaClient from "../../prisma";

class DeleteCategoryService {
  async execute(categoryId: number) {
    const category = await prismaClient.category.findUnique({
      where: { id: categoryId },
      include: { subcategories: true },
    });

    if (!category) {
      throw new Error("Category not found");
    }

    const hasServices = await prismaClient.service.findFirst({
      where: {
        subcategoryId: {
          in: category.subcategories.map((sub) => sub.id),
        },
      },
    });

    if (hasServices) {
      throw new Error(
        "Cannot delete category with subcategories that have services"
      );
    }

    await prismaClient.category.delete({
      where: { id: categoryId },
    });

    return { message: "Category deleted successfully" };
  }
}

export { DeleteCategoryService };