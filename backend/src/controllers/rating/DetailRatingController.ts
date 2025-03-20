import { Request, Response } from 'express';
import { DetailRatingService } from '../../services/rating/DetailRatingService';

class DetailRatingController {
  async handle(req: Request, res: Response) {
    const { serviceId } = req.params;  
    const detailRatingService = new DetailRatingService();

    try {
      const ratingDetails = await detailRatingService.execute({ serviceId : Number(serviceId) });
      return res.json(ratingDetails);
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }
}

export { DetailRatingController };