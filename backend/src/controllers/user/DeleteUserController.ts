import { Request, Response } from "express";
import { DeleteUserService } from "../../services/user/DeleteUserService";

class DeleteUserController {
  async handle(req: Request, res: Response) {
    const { userId } = req.params;
    const currentUserId = Number(req.user_id);

    if (!currentUserId) {
      return res.status(401).json({ error: "User not authenticated" });
    }

    try {
      const deleteUserService = new DeleteUserService();
      const result = await deleteUserService.execute({ userId: Number(userId), currentUserId });
      return res.status(200).json(result);
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }
}

export { DeleteUserController };