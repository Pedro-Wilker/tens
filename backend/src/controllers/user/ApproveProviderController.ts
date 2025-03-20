import { Request, Response } from 'express';
import { ApproveProviderService } from '../../services/user/ApproveProviderService'; 


class ApproveProviderController {
  async handle(req: Request, res: Response) {
    const { userId } = req.params;
    const approveProviderService = new ApproveProviderService();
    try {
      const approvedProvider = await approveProviderService.execute({ userId: Number(userId) } );
      return res.json(approvedProvider);
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }
}

export { ApproveProviderController };