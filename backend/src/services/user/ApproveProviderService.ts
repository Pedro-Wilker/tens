import prismaClient from '../../prisma';
import { Role } from '@prisma/client';

interface ApproveProviderReq {
  userId: number;
}

class ApproveProviderService {
  async execute({ userId }: ApproveProviderReq) {
   
    const user = await prismaClient.user.findUnique({
      where: { id: userId }
    });

    if (!user) {
      throw new Error('User not found');
    }

    
    if (user.role !== Role.PROVIDERAWAIT) {
      throw new Error('User is not awaiting approval to be a provider');
    }

    
    const updatedUser = await prismaClient.user.update({
      where: { id: userId },
      data: {
        role: Role.PROVIDER
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

export { ApproveProviderService };