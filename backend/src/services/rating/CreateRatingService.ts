import prismaClient from '../../prisma';

interface CreateRatingRequest {
  serviceId: number;
  userId: number;
  rating: number;
}

class CreateRatingService {
  async execute({ serviceId, userId, rating }: CreateRatingRequest) {
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

    const existingRating = await prismaClient.rating.findFirst({
      where: {
        serviceId: serviceId,
        userId: userId,
      }
    });

    if (existingRating) {
      throw new Error('You have already rated this service');
    }

    if (rating < 1 || rating > 5) {
      throw new Error('Rating must be between 1 and 5');
    }

    const newRating = await prismaClient.rating.create({
      data: {
        serviceId,
        userId,
        rating,
      },
      select: {
        id: true,
        serviceId: true,
        userId: true,
        rating: true,
        createdAt: true,
      },
    });

    return newRating;
  }
}

export { CreateRatingService };