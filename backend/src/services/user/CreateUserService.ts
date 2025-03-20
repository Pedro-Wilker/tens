import prismaClient from '../../prisma';
import { hash } from 'bcryptjs';
import { Role } from '@prisma/client';

interface UserReq {
  name: string;
  password: string;
  email: string;
  number: string;
  analfabeto?: boolean;
}

class CreateUserService {
  async execute({ email, name, password, number, analfabeto }: UserReq) {
    if (!email) throw new Error('Email incorrect');
    if (!number) throw new Error('Number cannot be empty');

    const numberRegex = /^\d{10,11}$/;
    if (!numberRegex.test(number)) {
      throw new Error('O número de telefone deve ter 10 ou 11 dígitos.');
    }

    const userAlreadyExistsByEmail = await prismaClient.user.findFirst({
      where: { email },
    });

    if (userAlreadyExistsByEmail) throw new Error('User already exists with this email');

    const userAlreadyExistsByNumber = await prismaClient.user.findFirst({
      where: { number },
    });

    if (userAlreadyExistsByNumber) throw new Error('User already exists with this number');

    const passwordHash = await hash(password, 8);

    const user = await prismaClient.user.create({
      data: {
        name,
        email,
        role: Role.CLIENT,
        passwordHash,
        number,
        analfabeto: analfabeto ?? false,
      },
      select: {
        id: true,
        email: true,
        role: true,
        name: true,
        number: true,
        analfabeto: true,
      },
    });

    return user;
  }
}

export { CreateUserService };