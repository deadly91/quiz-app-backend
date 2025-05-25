import express, { Response } from "express";
import User from "../../models/User";
import Score from "../../models/Score"; // adjust path
import Question from "../../models/Question";
import { authMiddleware, AuthenticatedRequest } from "../../middleware/auth";
import { requireAdmin } from "../../middleware/requireadmin";

const router = express.Router();

router.get(
  "/",
  authMiddleware,
  requireAdmin,
  async (_req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const [
        totalUsers,
        bannedUsers,
        totalQuizzes,
        totalQuestions,
        newUsersThisWeek,
        activeUsersThisWeek,
        avgScoreAgg,
        highestScoreDoc,
        lowestScoreDoc,
        mostUsedCategoryAgg,
      ] = await Promise.all([
        User.countDocuments(),
        User.countDocuments({ isBanned: true }),
        Score.countDocuments(),
        Question.countDocuments(),
        User.countDocuments({
          createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
        }),
        User.countDocuments({
          lastLogin: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
        }),
        Score.aggregate([{ $group: { _id: null, avg: { $avg: "$score" } } }]),
        Score.findOne().sort({ score: -1 }),
        Score.findOne().sort({ score: 1 }),
        Score.aggregate([
          { $group: { _id: "$category", count: { $sum: 1 } } },
          { $sort: { count: -1 } },
          { $limit: 1 },
        ]),
      ]);

      const averageScore = avgScoreAgg[0]?.avg || 0;
      const highestScore = highestScoreDoc?.score || 0;
      const lowestScore = lowestScoreDoc?.score || 0;
      const mostUsedCategory = mostUsedCategoryAgg[0]?._id || "N/A";

      res.json({
        totalUsers,
        bannedUsers,
        totalQuizzes,
        totalQuestions,
        newUsersThisWeek,
        activeUsersThisWeek,
        averageScore,
        highestScore,
        lowestScore,
        mostUsedCategory,
      });
    } catch (err) {
      console.error("Failed to fetch metrics", err);
      res.status(500).json({ error: "Failed to fetch metrics" });
    }
  }
);

export default router;
