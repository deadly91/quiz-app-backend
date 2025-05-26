import express from "express";
import { authMiddleware } from "../../../middleware/auth";
import { requireAdmin } from "../../../middleware/requireadmin";
import Question from "../../../models/Question";

const router = express.Router();

router.post(
  "/add-question",
  authMiddleware,
  requireAdmin,
  async (req, res): Promise<void> => {
    const { text, options, correctAnswer, category, timeLimit } = req.body;

    if (
      !text ||
      !Array.isArray(options) ||
      options.length !== 4 ||
      !correctAnswer ||
      !options.includes(correctAnswer)
    ) {
      res.status(400).json({ error: "Invalid input data." });
      return;
    }

    try {
      const newQuestion = await Question.create({
        text,
        options,
        correctAnswer,
        category,
        timeLimit,
      });

      res.status(201).json(newQuestion);
    } catch (err) {
      console.error("Add Question Error:", err);
      res.status(500).json({ error: "Failed to add question." });
    }
  }
);

export default router;
