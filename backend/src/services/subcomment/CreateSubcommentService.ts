import prismaClient from "../../prisma";

interface CreateSubcommentRequest {
  commentId: number; 
  userId: number; 
  text: string; 
}

class CreateSubcommentService {
  async execute({ commentId, userId, text }: CreateSubcommentRequest) {
    const comment = await prismaClient.comment.findUnique({
      where: { id: commentId },
    });

    if (!comment) {
      throw new Error("Parent comment not found");
    }

    const user = await prismaClient.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new Error("User not found");
    }

    const subcomment = await prismaClient.subcomment.create({
      data: {
        commentId,
        userId,
        text,
      },
      select: {
        id: true,
        commentId: true,
        userId: true,
        text: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return subcomment;
  }
}

export { CreateSubcommentService };