import prismaClient from "../../prisma";

interface SubcategoryRequest {
  categoryId: number; 
  name: string;
}

class CreateSubcategoryService {
  async execute({ categoryId, name }: SubcategoryRequest) {
    if (!categoryId) {
      throw new Error("Category ID is required");
    }

    if (!name) {
      throw new Error("Subcategory name is required");
    }

    const categoryExists = await prismaClient.category.findUnique({
      where: { id: categoryId },
    });

    if (!categoryExists) {
      throw new Error("Category not found");
    }

    const subcategoryAlreadyExists = await prismaClient.subcategory.findFirst({
      where: { name, categoryId },
    });

    if (subcategoryAlreadyExists) {
      throw new Error("Subcategory name already exists in this category");
    }

    const subcategory = await prismaClient.subcategory.create({
      data: {
        name,
        categoryId,
      },
    });

    return {
      id: subcategory.id,
      name: subcategory.name,
      categoryId: subcategory.categoryId,
      createdAt: subcategory.createdAt,
      updatedAt: subcategory.updatedAt,
    };
  }
}

export { CreateSubcategoryService };