import prismaClient from '../../prisma';

interface CreateCommentRequest {
  serviceId: number;
  userId: number;
  text: string;
}
class CreateCommentService {
  async execute({ serviceId, userId, text }: CreateCommentRequest) {
    
    if (!userId) {
      throw new Error('Invalid userId');
    }

    const service = await prismaClient.service.findUnique({
      where: { id: serviceId }
    });

    if (!service) {
      throw new Error('Service not found');
    }

    const user = await prismaClient.user.findUnique({
      where: { id: userId }
    });

    if (!user) {
      throw new Error('User not found');
    }

    const newComment = await prismaClient.comment.create({
      data: {
        serviceId,
        userId,
        text,
      },
      select: {
        id: true,
        serviceId: true,
        userId: true,
        text: true,
        createdAt: true,
      },
    });

    return newComment;
  }
}

export { CreateCommentService };