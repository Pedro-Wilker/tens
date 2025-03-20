import prismaClient from '../../prisma';
import { Role } from '@prisma/client';

interface RoleReq {
  userId: number; 
  roleSelection: 'CLIENT' | 'PROVIDER';
}

class CreateRoleService {
  async execute({ userId, roleSelection }: RoleReq) {
    const user = await prismaClient.user.findUnique({
      where: { id: userId } 
    });

    if (!user) {
      throw new Error('User not found');
    }

    let newRole: Role;
    if (roleSelection === 'CLIENT') {
      newRole = Role.CLIENT;
    } else if (roleSelection === 'PROVIDER') {
      newRole = Role.PROVIDERAWAIT;
    } else {
      throw new Error('Invalid role selection');
    }

    const updatedUser = await prismaClient.user.update({
      where: { id: userId }, 
      data: {
        role: newRole
      },
      select: {
        id: true,
        email: true,
        role: true,
        name: true,
        number: true,
      },
    });

    return updatedUser;
  }
}

export { CreateRoleService };