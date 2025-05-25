import express from "express";
import { Request, Response } from "express";
import dbConnect from "../../lib/db";
import Score from "../../models/Score";
import { authMiddleware } from "../../middleware/auth";

const router = express.Router();

router.get(
  "/scores",
  authMiddleware,
  async (_req: Request, res: Response): Promise<void> => {
    await dbConnect();

    const scores = await Score.find({}).sort({ score: -1 }).limit(10).lean();

    if (!scores.length) {
      res.json(
        Array.from({ length: 5 }, (_, i) => ({
          email: `Player ${i + 1}`,
          score: 0,
          date: new Date().toISOString(),
        }))
      );
      return;
    }

    const ranked = scores.map((s, i) => ({
      rank: i + 1,
      email: s.email || "Unknown",
      score: s.score,
      date: s.date,
    }));

    res.json(ranked);
  }
);

export default router;
