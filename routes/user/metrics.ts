import express, { Response, Request } from "express";
import dbConnect from "../../lib/db";
import Score from "../../models/Score";
import { authMiddleware, AuthenticatedRequest } from "../../middleware/auth";

const router = express.Router();

router.get("/metrics", authMiddleware, async (req: Request, res: Response) => {
  const { userId } = req as AuthenticatedRequest;

  try {
    await dbConnect();

    if (!userId) {
      res.status(400).json({ error: "Missing user ID" });
      return;
    }

    const scores = await Score.find({ userId }).sort({ date: -1 });

    const totalQuizzes = scores.length;
    const bestScore = scores.reduce((max, s) => Math.max(max, s.score), 0);

    res.json({
      totalQuizzes,
      bestScore,
    });
  } catch (err) {
    console.error("Metrics error:", err);
    res.status(500).json({ error: "Failed to fetch metrics" });
  }
});

export default router;
