import prismaClient from "../../prisma";

class DetailUserService {
  async execute(user_id: number) {
    const user = await prismaClient.user.findFirst({
      where: {
        id: user_id,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        number: true, 
        analfabeto: true, 
      },
    });

    return user;
  }
}

export { DetailUserService };