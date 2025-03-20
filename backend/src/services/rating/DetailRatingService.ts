import prismaClient from '../../prisma';

interface DetailRatingRequest {
  serviceId: number;
}

class DetailRatingService {
  async execute({ serviceId }: DetailRatingRequest) {
    
    const serviceRatings = await prismaClient.rating.findMany({
      where: {
        serviceId: serviceId,
      },
      include: {
        service: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          }
        }
      }
    });

    if (serviceRatings.length === 0) {
      throw new Error('No ratings found for this service');
    }

    const totalRatings = serviceRatings.length;
    const sumRatings = serviceRatings.reduce((sum, r) => sum + r.rating, 0);
    const averageRating = totalRatings > 0 ? sumRatings / totalRatings : 0;

    return {
      serviceRatings,
      serviceAverageRating: parseFloat(averageRating.toFixed(2))
    };
  }
}

export { DetailRatingService };