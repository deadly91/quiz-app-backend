import express from "express";
import { authMiddleware, AuthenticatedRequest } from "../../middleware/auth";
import User from "../../models/User";

const router = express.Router();

router.get(
  "/profile",
  authMiddleware,
  async (req: AuthenticatedRequest, res): Promise<void> => {
    const user = await User.findById(req.userId).select("nickname totalPoints");

    if (!user) {
      res.json({ nickname: user.nickname, totalPoints: user.totalPoints });
      res.status(404).json({ error: "User not found" });
      return;
    }
  }
);

export default router;
