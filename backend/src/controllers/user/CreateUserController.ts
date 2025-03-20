import { Request, Response } from 'express';
import { CreateUserService } from '../../services/user/CreateUserService';

class CreateUserController {
  async handle(req: Request, res: Response) {
    const { name, password, email, number, analfabeto } = req.body;
    
    const userService = new CreateUserService();
    const user = await userService.execute({ email, name, password, number, analfabeto });
    
    return res.json(user);
  }
}

export { CreateUserController };