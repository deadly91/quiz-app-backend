import express, { Request, Response, NextFunction } from "express";
import dbConnect from "../../lib/db";
import Question from "../../models/Question";
import { authMiddleware } from "../../middleware/auth";

const router = express.Router();

interface AuthenticatedRequest extends Request {
  userId?: string;
}

router.get(
  "/questions",
  authMiddleware,
  async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      await dbConnect();

      const quizType = req.query.type;
      const questions = await Question.find({ category: quizType }).select(
        "-__v"
      );

      res.status(200).json({ questions });
    } catch (err) {
      console.error("Failed to fetch questions:", err);
      res.status(500).json({ error: "Failed to load questions" });
    }
  }
);

export default router;
