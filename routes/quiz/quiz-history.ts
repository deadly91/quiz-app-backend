import express from "express";
import QuizResult from "../../models/QuizResult";
import { authMiddleware, AuthenticatedRequest } from "../../middleware/auth";

const router = express.Router();

router.get(
  "/quiz-history",
  authMiddleware,
  async (req: AuthenticatedRequest, res) => {
    try {
      const history = await QuizResult.find({ userId: req.userId })
        .sort({ date: -1 })
        .limit(50)
        .lean();

      res.json(history);
    } catch (err) {
      console.error("Fetch quiz history failed:", err);
      res.status(500).json({ error: "Failed to load quiz history" });
    }
  }
);

export default router;
