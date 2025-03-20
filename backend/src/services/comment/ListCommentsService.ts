import prismaClient from "../../prisma";

interface ListCommentsRequest {
  serviceId: number;
}

class ListCommentsService {
  async execute({ serviceId }: ListCommentsRequest) {
    const service = await prismaClient.service.findUnique({
      where: { id: serviceId },
    });

    if (!service) {
      throw new Error("Service not found");
    }

    const comments = await prismaClient.comment.findMany({
      where: { serviceId: serviceId },
      select: {
        id: true,
        text: true,
        createdAt: true,
        user: {
          select: { id: true, name: true },
        },
        subcomments: {
          select: {
            id: true,
            text: true,
            createdAt: true,
            user: { select: { id: true, name: true } },
          },
          orderBy: { createdAt: "desc" },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return comments;
  }
}

export { ListCommentsService };