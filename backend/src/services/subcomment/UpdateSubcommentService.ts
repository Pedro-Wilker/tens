import prismaClient from "../../prisma";

interface SubcommentRequest {
  subcommentId: number;
  text: string;
  userId: number;
}

class UpdateSubcommentService {
  async execute({ subcommentId, text, userId }: SubcommentRequest) {
    if (!subcommentId) {
      throw new Error("Subcomment ID is required");
    }
    if (!text) {
      throw new Error("Subcomment text is required");
    }
    if (!userId) {
      throw new Error("User ID is required");
    }

    const subcomment = await prismaClient.subcomment.findUnique({
      where: { id: subcommentId },
    });

    if (!subcomment) {
      throw new Error("Subcomment not found");
    }

    if (subcomment.userId !== userId) {
      throw new Error("Only the subcomment author can update this subcomment");
    }

    const updatedSubcomment = await prismaClient.subcomment.update({
      where: { id: subcommentId },
      data: {
        text,
        updatedAt: new Date(),
      },
      include: {
        user: { select: { id: true, name: true } },
      },
    });

    return {
      id: updatedSubcomment.id,
      commentId: updatedSubcomment.commentId,
      userId: updatedSubcomment.userId,
      text: updatedSubcomment.text,
      createdAt: updatedSubcomment.createdAt,
      updatedAt: updatedSubcomment.updatedAt,
      user: updatedSubcomment.user,
    };
  }
}

export { UpdateSubcommentService };