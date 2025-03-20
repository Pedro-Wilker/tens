import { Request, Response } from "express";
import { UpdateCommentService } from "../../services/comment/UpdateCommentService";

class UpdateCommentController {
  async handle(req: Request, res: Response) {
    const { commentId } = req.params;
    const { text } = req.body;
    const userId = Number(req.user_id); 

    if (!userId) {
      return res.status(401).json({ error: "User not authenticated" });
    }
    if (!commentId) {
      return res.status(400).json({ error: "Comment ID is required" });
    }
    if (!text) {
      return res.status(400).json({ error: "Comment text is required" });
    }

    const updateCommentService = new UpdateCommentService();

    try {
      const updatedComment = await updateCommentService.execute({
        commentId: Number(commentId),
        text,
        userId,
      });
      return res.status(200).json(updatedComment);
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }
}

export { UpdateCommentController };