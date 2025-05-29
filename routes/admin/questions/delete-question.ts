import express from "express";
import { authMiddleware, AuthenticatedRequest } from "../../../middleware/auth";
import { requireAdmin } from "../../../middleware/requireadmin";
import Question from "../../../models/Question";

const router = express.Router();

// DELETE /api/admin/questions/:id
router.delete(
  "/:id",
  authMiddleware,
  requireAdmin,
  async (req: AuthenticatedRequest, res): Promise<void> => {
    const { id } = req.params;

    try {
      const deleted = await Question.findByIdAndDelete(id);

      if (!deleted) {
        res.status(404).json({ error: "Question not found" });
        return;
      }

      res.json({ message: "Question deleted successfully" });
    } catch (error) {
      console.error("Error deleting question:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
);

export default router;
