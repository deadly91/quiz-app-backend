import express, { Response } from "express";
import { authMiddleware, AuthenticatedRequest } from "../../../middleware/auth";
import { requireAdmin } from "../../../middleware/requireadmin";
import Question from "../../../models/Question";

const router = express.Router();

router.get(
  "/",
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
