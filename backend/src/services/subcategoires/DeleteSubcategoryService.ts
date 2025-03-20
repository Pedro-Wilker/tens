import prismaClient from "../../prisma";

class DeleteSubcategoryService {
  async execute(subcategoryId: number) {
    const subcategory = await prismaClient.subcategory.findUnique({
      where: { id: subcategoryId },
      include: { services: true },
    });

    if (!subcategory) {
      throw new Error("Subcategory not found");
    }

    if (subcategory.services.length > 0) {
      throw new Error("Cannot delete subcategory with associated services");
    }

    await prismaClient.subcategory.delete({
      where: { id: subcategoryId },
    });

    return { message: "Subcategory deleted successfully" };
  }
}

export { DeleteSubcategoryService };