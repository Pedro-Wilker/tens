import { Request, Response } from 'express';
import { CreateRatingService } from '../../services/rating/CreateRatingService';

class CreateRatingController {
  async handle(req: Request, res: Response) {
    const { serviceId, rating } = req.body;
    const userId = Number(req.user_id); 

    const createRatingService = new CreateRatingService();

    try {
      const newRating = await createRatingService.execute({ serviceId:Number(serviceId), userId, rating });
      return res.status(201).json(newRating);
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }
}

export { CreateRatingController };