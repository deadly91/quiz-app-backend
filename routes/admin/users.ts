import express, { Response } from "express";
import User from "../../models/User";
import { authMiddleware, AuthenticatedRequest } from "../../middleware/auth";
import { requireAdmin } from "../../middleware/requireadmin";

const router = express.Router();

// GET /admin/users — Admin can view all users
router.get(
  "/users",
  authMiddleware,
  requireAdmin,
  async (_req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const users = await User.find().select("email nickname role createdAt");
      res.json(users);
    } catch (err) {
      console.error("Failed to fetch users", err);
      res.status(500).json({ error: "Server error fetching users" });
    }
  }
);

export default router;
