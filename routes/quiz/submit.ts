import express, { Request, Response } from "express";
import dbConnect from "../../lib/db";
import Score from "../../models/Score";
import User from "../../models/User";
import { authMiddleware } from "../../middleware/auth";

const router = express.Router();

interface AuthenticatedRequest extends Request {
  userId?: string;
}

router.post(
  "/submit",
  authMiddleware,
  async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      await dbConnect();

      const { score } = req.body;
      const userId = req.userId;

      if (!userId || typeof score !== "number") {
        res.status(400).json({ error: "Invalid data" });
        return;
      }

      // Save score to Score collection
      await Score.create({ userId, score });

      // Add to totalPoints
      await User.findByIdAndUpdate(userId, { $inc: { totalPoints: score } });

      res.json({ success: true });
    } catch (err) {
      console.error("Error submitting score", err);
      res.status(500).json({ error: "Failed to submit score" });
    }
  }
);

export default router;
