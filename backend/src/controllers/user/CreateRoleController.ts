import { Request, Response } from 'express';
import { CreateRoleService } from '../../services/user/CreateRoleService';

class CreateRoleController {
  async handle(req: Request, res: Response) {
    const { userId, roleSelection } = req.body; 

    if (!userId || isNaN(Number(userId))) {
      return res.status(400).json({ error: 'Invalid User ID' });
    }

    const roleService = new CreateRoleService();
    try {
      const user = await roleService.execute({ userId: Number(userId), roleSelection });
      return res.status(200).json(user);
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }
}

export { CreateRoleController };