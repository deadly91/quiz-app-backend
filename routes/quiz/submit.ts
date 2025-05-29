import express, { Request, Response } from "express";
import dbConnect from "../../lib/db";
import { authMiddleware } from "../../middleware/auth";
import Score from "../../models/Score";
import User from "../../models/User";
import QuizResult from "../../models/QuizResult";

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
      const {
        score,
        totalQuestions,
        correctAnswers,
        category = "general",
      } = req.body;
      const userId = req.userId;

      console.log("Received quiz submission:", {
        userId,
        score,
        totalQuestions,
        correctAnswers,
        category,
      });

      if (
        !userId ||
        typeof score !== "number" ||
        typeof totalQuestions !== "number" ||
        typeof correctAnswers !== "number"
      ) {
        console.warn("Invalid submission data:", {
          userId,
          score,
          totalQuestions,
          correctAnswers,
        });
        res.status(400).json({ error: "Invalid data" });
        return;
      }

      // Save to Score (optional legacy system)
      await Score.create({ userId, score });

      // Save to quiz history
      await QuizResult.create({
        userId,
        score,
        totalQuestions,
        correctAnswers,
        category,
      });

      // Update user's total points
      await User.findByIdAndUpdate(userId, { $inc: { totalPoints: score } });

      res.status(200).json({ success: true });
    } catch (err) {
      console.error("Quiz submit error:", err);
      res.status(500).json({ error: "Failed to submit quiz" });
    }
  }
);

export default router;
