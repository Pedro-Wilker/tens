import prismaClient from "../../prisma";

class ListUserAllService {
  async execute(user_id: number) {
 
    const user = await prismaClient.user.findUnique({
      where: {
        id: user_id,
      },
      include: {
        services: {
          include: {
            serviceDetails: true,
            ratings: true,
            subcategory: true,
          },
        },
        comments: {
          include: {
            subcomments: true,
          },
        },
        ratings: true,
      },
    });

    if (!user) {
      
      throw new Error("Usuário não encontrado");
    }


    return {
      id: user.id,
      name: user.name,
      email: user.email,
      number: user.number,
      passwordHash: user.passwordHash, 
      role: user.role,
      services: user.services,
      comments: user.comments,
      ratings: user.ratings,
      createdAt: user.createdAt.toISOString(),
      updatedAt: user.updatedAt.toISOString(),
    };
  }
}

export { ListUserAllService };