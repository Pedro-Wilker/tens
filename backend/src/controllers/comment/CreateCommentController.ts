import { Request, Response } from 'express';
import { CreateCommentService } from '../../services/comment/CreateCommentService';

class CreateCommentController {
  async handle(req: Request, res: Response) {
    const { serviceId, text } = req.body;
    const userId = Number(req.user_id); 

    if (!userId) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    const createCommentService = new CreateCommentService();

    try {
      const newComment = await createCommentService.execute({ serviceId:Number(serviceId), userId, text });
      return res.status(201).json(newComment);
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }
}

export { CreateCommentController };