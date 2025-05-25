import express from "express";
import Question from "../../models/Question";
import { authMiddleware, AuthenticatedRequest } from "../../middleware/auth";
import { requireAdmin } from "../../middleware/requireadmin";
import { Response } from "express";

const router = express.Router();

router.post(
  "/add-question",
  authMiddleware,
  requireAdmin,
  async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    const {
      text,
      options,
      correctAnswer,
      category = "react-native",
      timeLimit = 10,
    } = req.body;

    // Validate input
    if (
      !text ||
      !Array.isArray(options) ||
      options.length !== 4 ||
      !correctAnswer ||
      !options.includes(correctAnswer)
    ) {
      res.status(400).json({
        error:
          "Invalid input. Must include question text, 4 options, and a valid correctAnswer.",
      });
      return;
    }

    try {
      const question = await Question.create({
        text,
        options,
        correctAnswer,
        category,
        timeLimit,
      });

      res
        .status(201)
        .json({ message: "Question created successfully", question });
    } catch (err) {
      console.error("Failed to create question:", err);
      res.status(500).json({ error: "Server error while saving question" });
    }
  }
);
router.get(
  "/questions",
  authMiddleware,
  requireAdmin,
  async (_req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const questions = await Question.find().sort({ createdAt: -1 }).lean();
      res.json(questions);
    } catch (err) {
      console.error("Failed to fetch questions:", err);
      res.status(500).json({ error: "Failed to fetch questions" });
    }
  }
);
export default router;
