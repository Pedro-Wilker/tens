import prismaClient from "../../prisma";

interface CommentRequest {
  commentId: number;
  text: string;
  userId: number;
}

class UpdateCommentService {
  async execute({ commentId, text, userId }: CommentRequest) {
    if (!commentId) {
      throw new Error("Comment ID is required");
    }
    if (!text) {
      throw new Error("Comment text is required");
    }
    if (!userId) {
      throw new Error("User ID is required");
    }

    const comment = await prismaClient.comment.findUnique({
      where: { id: commentId },
    });

    if (!comment) {
      throw new Error("Comment not found");
    }

    if (comment.userId !== userId) {
      throw new Error("Only the comment author can update this comment");
    }

    const updatedComment = await prismaClient.comment.update({
      where: { id: commentId },
      data: {
        text,
        updatedAt: new Date(),
      },
      include: {
        user: { select: { id: true, name: true } },
        service: { select: { id: true, name: true } },
      },
    });

    return {
      id: updatedComment.id,
      serviceId: updatedComment.serviceId,
      userId: updatedComment.userId,
      text: updatedComment.text,
      createdAt: updatedComment.createdAt,
      updatedAt: updatedComment.updatedAt,
      user: updatedComment.user,
      service: updatedComment.service,
    };
  }
}

export { UpdateCommentService };