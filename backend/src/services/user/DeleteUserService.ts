import prismaClient from "../../prisma";

interface DeleteUserRequest {
  userId: number;
  currentUserId: number;
}

class DeleteUserService {
  async execute({ userId, currentUserId }: DeleteUserRequest) {
    if (!userId) {
      throw new Error("User ID is required");
    }

    const user = await prismaClient.user.findUnique({
      where: { id: userId },
      include: { services: true, comments: true, ratings: true },
    });

    if (!user) {
      throw new Error("User not found");
    }

    if (currentUserId !== userId) {
      const currentUser = await prismaClient.user.findUnique({
        where: { id: currentUserId },
      });

      if (!currentUser || (currentUser.role !== "ADMIN" && currentUser.role !== "SUPPORT")) {
        throw new Error("Only the user or an admin/support can delete this user");
      }
    }

    if (user.services.length > 0 || user.comments.length > 0 || user.ratings.length > 0) {
      throw new Error("Cannot delete user with associated services, comments, or ratings");
    }

    await prismaClient.user.delete({
      where: { id: userId },
    });

    return { message: "User deleted successfully" };
  }
}

export { DeleteUserService };