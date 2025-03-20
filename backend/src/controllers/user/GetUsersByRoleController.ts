import { Request, Response } from 'express';
import { GetUsersByRoleService } from '../../services/user/GetUsersByRoleService';
import { Role } from '@prisma/client';

class GetUsersByRoleController {
  async handle(req: Request, res: Response) {
    const { role } = req.params; 

    const userService = new GetUsersByRoleService();
    const users = await userService.execute(role as Role); 

    return res.json(users);
  }
}

export { GetUsersByRoleController };