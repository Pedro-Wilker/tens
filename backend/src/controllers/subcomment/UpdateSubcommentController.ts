import { Request, Response } from "express";
import { UpdateSubcommentService } from "../../services/subcomment/UpdateSubcommentService";

class UpdateSubcommentController {
  async handle(req: Request, res: Response) {
    const { subcommentId } = req.params;
    const { text } = req.body;
    const userId = Number(req.user_id);

    if (!userId) {
      return res.status(401).json({ error: "User not authenticated" });
    }
    if (!subcommentId) {
      return res.status(400).json({ error: "Subcomment ID is required" });
    }
    if (!text) {
      return res.status(400).json({ error: "Subcomment text is required" });
    }

    const updateSubcommentService = new UpdateSubcommentService();

    try {
      const updatedSubcomment = await updateSubcommentService.execute({
        subcommentId: Number(subcommentId),
        text,
        userId,
      });
      return res.status(200).json(updatedSubcomment);
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }
}

export { UpdateSubcommentController };