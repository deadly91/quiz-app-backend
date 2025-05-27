import express, { Request, Response } from "express";
import dbConnect from "../../lib/db";
import { authMiddleware } from "../../middleware/auth";
import Score from "../../models/Score";
import User from "../../models/User";

const router = express.Router();

interface AuthRequest extends Request {
  userId?: string;
}

router.post(
  "/submit",
  authMiddleware,
  async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      await dbConnect();
      const { score } = req.body;
      const userId = req.userId;

      console.log("Received score submission:", { userId, score });

      if (!userId || typeof score !== "number") {
        console.warn("Invalid submission data:", { userId, score });
        res.status(400).json({ error: "Invalid data" });
        return;
      }

      await Score.create({ userId, score });
      await User.findByIdAndUpdate(userId, { $inc: { totalPoints: score } });

      res.status(200).json({ success: true });
      return;
    } catch (err) {
      console.error("Submit error:", err);
      res.status(500).json({ error: "Failed to submit score" });
      return;
    }
  }
);

export default router;
