import prismaClient from "../../prisma";
import { compare } from "bcryptjs";
import { sign } from "jsonwebtoken";

interface AuthRequest {
  email: string;
  password: string;
}

class AuthUserService {
  async execute({ email, password }: AuthRequest) {
    const user = await prismaClient.user.findFirst({
      where: {
        email: email,
      },
    });

    if (!user) {
      throw new Error("User/password incorrect");
    }

    const passwordMatch = await compare(password, user.passwordHash);

    if (!passwordMatch) {
      throw new Error("User/password incorrect");
    }

   
    const userIdAsString = String(user.id);
  
    if (!userIdAsString || typeof userIdAsString !== 'string') {
      throw new Error('Failed to convert user.id to string');
    }

    try {
      const token = sign(
        {
          name: user.name,
          email: user.email,
          role: user.role,
        },
        process.env.JWT_SECRET,
        {
          subject: userIdAsString, 
          expiresIn: "30d",
        }
      );
      return {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: token,
      };
    } catch (error) {
      console.error('AuthUserService - JWT Error:', error.message);
      throw new Error(error.message);
    }
  }
}

export { AuthUserService };