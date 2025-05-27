import express from "express";
import dbConnect from "../../lib/db";
import Score from "../../models/Score";

const router = express.Router();

router.get("/scores", async (req, res) => {
  try {
    await dbConnect();

    const scores = await Score.find()
      .sort({ score: -1 })
      .limit(10)
      .populate("userId", "nickname");

    const formatted = scores.map((entry, index) => ({
      rank: index + 1,
      nickname: entry.userId?.nickname || "Unknown",
      score: entry.score,
    }));

    res.status(200).json(formatted);
  } catch (err) {
    console.error("Error fetching scores:", err);
    res.status(500).json({ error: "Failed to get scores" });
  }
});

export default router;
