import { Request, Response } from 'express';
import { ListUserAllService } from '../../services/user/ListUserAllServices';

class ListUserAllController {
  async handle(req: Request, res: Response) {
    const user_id = Number(req.user_id); 

    const listUserAllService = new ListUserAllService();

    try {
      const user = await listUserAllService.execute(user_id);
      return res.json(user);
    } catch (err) {
      console.error('Erro no controlador:', err.message);
      return res.status(400).json({ error: err.message });
    }
  }
}

export { ListUserAllController };