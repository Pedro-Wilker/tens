import { Request, Response } from "express";
import { CreateSubcommentService } from "../../services/subcomment/CreateSubcommentService";

class CreateSubcommentController {
  async handle(req: Request, res: Response) {
    const { commentId } = req.params;
    const { text } = req.body; 
    const userId = Number(req.user_id); 

    if (!userId) {
      return res.status(401).json({ error: "User not authenticated" });
    }

    try {
      const createSubcommentService = new CreateSubcommentService();
      const subcomment = await createSubcommentService.execute({ commentId: Number(commentId), userId, text });
      return res.status(201).json(subcomment);
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }
}

export { CreateSubcommentController };