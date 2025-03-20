import prismaClient from "../../prisma";

interface CategoryRequest {
  name: string;
  file: Express.Multer.File;
}

const isProduction = process.env.NODE_ENV === "production";

class CreateCategoryService {
  async execute({ name, file }: CategoryRequest) {
    if (!name) {
      throw new Error("Category name is required");
    }

    if (!file) {
      throw new Error("Image is required");
    }

    const categoryAlreadyExists = await prismaClient.category.findFirst({
      where: { name },
    });

    if (categoryAlreadyExists) {
      throw new Error("Category already exists");
    }

    const category = await prismaClient.category.create({
      data: {
        name,
        imageUrl: file.filename,
      },
    });

    return {
      ...category,
      imageUrl: `/uploads/${category.imageUrl}`.replace("//", "/"), 
    };
  }
}

export { CreateCategoryService };