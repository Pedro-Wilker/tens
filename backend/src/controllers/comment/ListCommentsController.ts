import { Request, Response } from 'express';
import { ListCommentsService } from '../../services/comment/ListCommentsService';

class ListCommentsController {
  async handle(req: Request, res: Response) {
    const { serviceId } = req.params;
    const listCommentsService = new ListCommentsService();

    try {
      const comments = await listCommentsService.execute({ serviceId: Number(serviceId) });
      return res.json(comments);
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }
}

export { ListCommentsController };