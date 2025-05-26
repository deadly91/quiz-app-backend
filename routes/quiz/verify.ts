import express, { Request, Response } from "express";
import dbConnect from "../../lib/db";
import Question from "../../models/Question";
import { authMiddleware } from "../../middleware/auth";

const router = express.Router();

router.post(
  "/verify",
  authMiddleware,
  async (req: Request, res: Response): Promise<void> => {
    try {
      await dbConnect();

      const { questionId, selected } = req.body;
      if (!questionId || !selected) {
        res.status(400).json({ error: "Missing data" });
        return;
      }

      const question = await Question.findById(questionId);
      if (!question) {
        res.status(404).json({ error: "Question not found" });
        return;
      }

      const isCorrect = question.correctAnswer === selected;
      res.json({ correct: isCorrect });
    } catch (err) {
      console.error("Error in verify route", err);
      res.status(500).json({ error: "Internal server error" });
    }
  }
);

export default router;
