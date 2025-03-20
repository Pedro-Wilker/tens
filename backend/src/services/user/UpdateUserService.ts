import prismaClient from "../../prisma";
import { hash } from "bcryptjs"; 
import { Role } from "@prisma/client";

interface UpdateUserRequest {
  userId: number;
  name?: string;
  email?: string;
  number?: string;
  password?: string; 
  role?: Role;
  currentUserId?: number;
}

class UpdateUserService {
  async execute({ userId, name, email, number, password, role, currentUserId }: UpdateUserRequest) {
    if (!userId) {
      throw new Error("User ID is required");
    }

    if (!name && !email && !number && !password && !role) {
      throw new Error("At least one field (name, email, number, password, or role) must be provided to update");
    }

    const user = await prismaClient.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new Error("User not found");
    }

    if (currentUserId && currentUserId !== userId) {
      const currentUser = await prismaClient.user.findUnique({
        where: { id: currentUserId },
      });

      if (!currentUser || (currentUser.role !== "ADMIN" && currentUser.role !== "SUPPORT")) {
        throw new Error("Only the user or an admin/support can update this user");
      }
    }

    if (email && email !== user.email) {
      const emailAlreadyExists = await prismaClient.user.findUnique({
        where: { email },
      });

      if (emailAlreadyExists) {
        throw new Error("Email already exists");
      }
    }

    if (number && number !== user.number) {
      const numberAlreadyExists = await prismaClient.user.findUnique({
        where: { number },
      });

      if (numberAlreadyExists) {
        throw new Error("Phone number already exists");
      }
    }

    if (role && currentUserId && currentUserId !== userId) {
      const currentUser = await prismaClient.user.findUnique({
        where: { id: currentUserId },
      });

      if (!currentUser || (currentUser.role !== "ADMIN" && currentUser.role !== "SUPPORT")) {
        throw new Error("Only admins or support can update user roles");
      }
    }

    const updateData: {
      name?: string;
      email?: string;
      number?: string;
      passwordHash?: string;
      role?: Role;
    } = {};

    if (name) updateData.name = name;
    if (email) updateData.email = email;
    if (number) updateData.number = number;
    if (password) updateData.passwordHash = await hash(password, 8); 
    if (role && currentUserId) {
      const currentUser = await prismaClient.user.findUnique({
        where: { id: currentUserId },
      });
      if (currentUser && (currentUser.role === "ADMIN" || currentUser.role === "SUPPORT")) {
        updateData.role = role;
      }
    }

    const updatedUser = await prismaClient.user.update({
      where: { id: userId },
      data: updateData,
      select: {
        id: true,
        name: true,
        email: true,
        number: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return updatedUser;
  }
}

export { UpdateUserService };