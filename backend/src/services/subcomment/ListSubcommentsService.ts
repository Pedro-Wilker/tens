import prismaClient from "../../prisma";

interface ListSubcommentsRequest {
  commentId: number; 
}

class ListSubcommentsService {
  async execute({ commentId }: ListSubcommentsRequest) {
    const comment = await prismaClient.comment.findUnique({
      where: { id: commentId },
    });

    if (!comment) {
      throw new Error("Parent comment not found");
    }

    const subcomments = await prismaClient.subcomment.findMany({
      where: {
        commentId,
      },
      select: {
        id: true,
        text: true,
        createdAt: true,
        updatedAt: true,
        user: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return subcomments;
  }
}

export { ListSubcommentsService };