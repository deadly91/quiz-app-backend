import express from "express";
import User from "../../models/User";

const router = express.Router();

// GET /api/quiz/scores (GLOBAL leaderboard by totalPoints)
router.get("/scores", async (_req, res) => {
  try {
    const topUsers = await User.find({}, { nickname: 1, totalPoints: 1 })
      .sort({ totalPoints: -1 })
      .limit(10)
      .lean();

    const ranked = topUsers.map((user, index) => ({
      rank: index + 1,
      nickname: user.nickname || "Unknown",
      score: user.totalPoints || 0,
    }));

    res.json(ranked);
  } catch (err) {
    console.error("Leaderboard error:", err);
    res.status(500).json({ error: "Failed to load leaderboard" });
  }
});

export default router;
