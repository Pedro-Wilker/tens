import prismaClient from "../../prisma";
import fs from "fs";
import path from "path";

interface CategoryUpdateRequest {
  id: number;
  name?: string;
  file?: Express.Multer.File;
}

const isProduction = process.env.NODE_ENV === "production";
const uploadDir = process.env.UPLOAD_DIR || (isProduction ? "/public_html/uploads" : path.join(process.cwd(), "uploads"));

class UpdateCategoryService {
  async execute({ id, name, file }: CategoryUpdateRequest) {
    if (!id) throw new Error("Category ID is required");

    const category = await prismaClient.category.findUnique({ where: { id } });
    if (!category) throw new Error("Category not found");

    let newImageUrl = category.imageUrl;

    if (file) {
      if (category.imageUrl) {
        const oldImagePath = path.join(uploadDir, category.imageUrl);
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }

      newImageUrl = file.filename;
    }

    if (name && name !== category.name) {
      const nameExists = await prismaClient.category.findFirst({ where: { name } });
      if (nameExists && nameExists.id !== id) throw new Error("Category name already in use by another category");
    }

    const updatedCategory = await prismaClient.category.update({
      where: { id },
      data: {
        name: name ?? category.name,
        imageUrl: newImageUrl,
      },
    });

    return {
      ...updatedCategory,
      imageUrl: `/uploads/${updatedCategory.imageUrl}`.replace("//", "/"),
    };
  }
}

export { UpdateCategoryService };