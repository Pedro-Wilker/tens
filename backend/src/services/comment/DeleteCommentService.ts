import prismaClient from "../../prisma";

interface DeleteCommentRequest {
  commentId: number;
  userId: number; 
}

class DeleteCommentService {
  async execute({ commentId, userId }: DeleteCommentRequest) {
    const comment = await prismaClient.comment.findUnique({
      where: { id: commentId },
      include: { subcomments: true }, 
    });

    if (!comment) {
      throw new Error("Comment not found");
    }

    if (comment.userId !== userId) {
      throw new Error("Only the comment author can delete this comment");
    }

    if (comment.subcomments.length > 0) {
      throw new Error("Cannot delete comment with associated subcomments");
    }

    await prismaClient.comment.delete({
      where: { id: commentId },
    });

    return { message: "Comment deleted successfully" };
  }
}

export { DeleteCommentService };