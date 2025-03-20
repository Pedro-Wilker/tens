import { Request, Response } from "express";
import { DeleteCommentService } from "../../services/comment/DeleteCommentService";

class DeleteCommentController {
  async handle(req: Request, res: Response) {
    const { commentId } = req.params;
    const userId = Number(req.user_id); 

    if (!userId) {
      return res.status(401).json({ error: "User not authenticated" });
    }

    try {
      const deleteCommentService = new DeleteCommentService();
      const result = await deleteCommentService.execute({ commentId:Number(commentId), userId });
      return res.status(200).json(result);
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }
}

export { DeleteCommentController };