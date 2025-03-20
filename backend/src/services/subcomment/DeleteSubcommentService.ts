import prismaClient from "../../prisma";

interface DeleteSubcommentRequest {
  subcommentId: number;
  userId: number;
}

class DeleteSubcommentService {
  async execute({ subcommentId, userId }: DeleteSubcommentRequest) {
    const subcomment = await prismaClient.subcomment.findUnique({
      where: { id: subcommentId },
    });

    if (!subcomment) {
      throw new Error("Subcomment not found");
    }

    if (subcomment.userId !== userId) {
      throw new Error("Only the subcomment author can delete this subcomment");
    }

    await prismaClient.subcomment.delete({
      where: { id: subcommentId },
    });

    return { message: "Subcomment deleted successfully" };
  }
}

export { DeleteSubcommentService };