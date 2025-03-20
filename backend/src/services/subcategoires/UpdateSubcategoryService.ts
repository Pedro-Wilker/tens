import prismaClient from "../../prisma";

interface SubcategoryRequest {
  subcategoryId: number;
  name?: string; 
}

class UpdateSubcategoryService {
  async execute({ subcategoryId, name }: SubcategoryRequest) {
    if (!subcategoryId) {
      throw new Error("Subcategory ID is required");
    }

    if (!name) {
      throw new Error("Name must be provided to update");
    }

    const subcategory = await prismaClient.subcategory.findUnique({
      where: { id: subcategoryId },
    });

    if (!subcategory) {
      throw new Error("Subcategory not found");
    }

    if (name && name !== subcategory.name) {
      const subcategoryAlreadyExists = await prismaClient.subcategory.findFirst({
        where: { name, categoryId: subcategory.categoryId },
      });

      if (subcategoryAlreadyExists) {
        throw new Error("Subcategory name already exists in this category");
      }
    }

    const updatedSubcategory = await prismaClient.subcategory.update({
      where: { id: subcategoryId },
      data: {
        name,
      },
    });

    return {
      id: updatedSubcategory.id,
      name: updatedSubcategory.name,
      categoryId: updatedSubcategory.categoryId,
      createdAt: updatedSubcategory.createdAt,
      updatedAt: updatedSubcategory.updatedAt,
    };
  }
}

export { UpdateSubcategoryService };