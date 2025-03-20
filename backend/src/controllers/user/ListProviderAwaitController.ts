import { Request, Response } from 'express';
import { ListProviderAwaitService } from '../../services/user/ListProviderAwaitService';

class ListProviderAwaitController {
  async handle(req: Request, res: Response) {
    const listProviderAwaitService = new ListProviderAwaitService();
    try {
      const providersAwait = await listProviderAwaitService.execute();
      return res.json(providersAwait);
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }
}

export { ListProviderAwaitController };