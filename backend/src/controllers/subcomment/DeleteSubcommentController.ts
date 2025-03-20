import { Request, Response } from "express";
import { DeleteSubcommentService } from "../../services/subcomment/DeleteSubcommentService";

class DeleteSubcommentController {
  async handle(req: Request, res: Response) {
    const { subcommentId } = req.params;
    const userId = Number(req.user_id); 
    try {
      const deleteSubcommentService = new DeleteSubcommentService();
      const result = await deleteSubcommentService.execute({ subcommentId: Number(subcommentId), userId });
      return res.status(200).json(result);
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }
}

export { DeleteSubcommentController };