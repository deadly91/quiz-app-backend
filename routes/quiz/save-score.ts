import express, { Request, Response, NextFunction } from "express";
import dbConnect from "../../lib/db";
import Score from "../../models/Score";
import { authMiddleware } from "../../middleware/auth";

const router = express.Router();

// Extend Request to include userId from middleware
interface AuthenticatedRequest extends Request {
  userId?: string;
}

router.post(
  "/save-score",
  authMiddleware,
  async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { score, quizType } = req.body;
      const userId = req.userId;

      if (!userId) {
        res.status(401).json({ error: "Unauthorized" });
        return;
      }

      if (typeof score !== "number") {
        res.status(400).json({ error: "Invalid score format" });
        return;
      }

      await dbConnect();
      await Score.create({ userId, score, quizType });

      res.status(201).json({ message: "Score saved" });
    } catch (err) {
      console.error("Error saving score:", err);
      res.status(500).json({ error: "Internal server error" });
    }
  }
);

export default router;
