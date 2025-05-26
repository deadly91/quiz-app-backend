import express, { Request, Response } from "express";
import dbConnect from "../../lib/db";
import Question from "../../models/Question";
import { authMiddleware } from "../../middleware/auth";

const router = express.Router();

router.get("/random", authMiddleware, async (req: Request, res: Response) => {
  try {
    await dbConnect();

    const quizType = req.query.type || "react-native";

    const randomQuestions = await Question.aggregate([
      { $match: { category: quizType } },
      { $sample: { size: 10 } }, // randomly select 10
    ]);

    res.status(200).json({ questions: randomQuestions });
  } catch (err) {
    console.error("Failed to fetch quiz questions:", err);
    res.status(500).json({ error: "Failed to load quiz questions" });
  }
});

export default router;
