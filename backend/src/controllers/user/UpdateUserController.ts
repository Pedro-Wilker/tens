import { Request, Response } from "express";
import { UpdateUserService } from "../../services/user/UpdateUserService";

class UpdateUserController {
  async handle(req: Request, res: Response) {
    const { userId } = req.params;
    const currentUserId = Number(req.user_id); 
    const { name, email, number, password, role } = req.body; 

    if (!currentUserId) {
      return res.status(401).json({ error: "User not authenticated" });
    }

    try {
      const updateUserService = new UpdateUserService();
      const updatedUser = await updateUserService.execute({
        userId: Number(userId),
        name,
        email,
        number,
        password, 
        role,
        currentUserId,
      });
      return res.status(200).json(updatedUser);
    } catch (error) {
      console.error("Erro no UpdateUserController:", error.message);
      return res.status(400).json({ error: error.message });
    }
  }
}

export { UpdateUserController };