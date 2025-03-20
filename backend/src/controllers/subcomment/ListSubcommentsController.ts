import { Request, Response } from "express";
import { ListSubcommentsService } from "../../services/subcomment/ListSubcommentsService";

class ListSubcommentsController {
  async handle(req: Request, res: Response) {
    const { commentId } = req.params;

    try {
      const listSubcommentsService = new ListSubcommentsService();
      const subcomments = await listSubcommentsService.execute({ commentId: Number(commentId) });
      return res.status(200).json(subcomments);
    } catch (error) {
      return res.status(404).json({ error: error.message });
    }
  }
}

export { ListSubcommentsController };