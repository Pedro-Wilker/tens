import prismaClient from '../../prisma';
import { Role } from '@prisma/client';

class ListProviderAwaitService {
  async execute() {
    const providersAwait = await prismaClient.user.findMany({
      where: {
        role: Role.PROVIDERAWAIT
      },
      select: {
        id: true,
        email: true,
        role: true,
        name: true,
        number: true,
      },
    });

    return providersAwait;
  }
}

export { ListProviderAwaitService };