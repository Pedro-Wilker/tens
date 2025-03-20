import prismaClient from '../../prisma';
import { Role } from '@prisma/client';

class GetUsersByRoleService {
  async execute(role: Role) {
    const users = await prismaClient.user.findMany({
      where: {
        role: role
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        number: true
      }
    });
    return users;
  }
}

export { GetUsersByRoleService };