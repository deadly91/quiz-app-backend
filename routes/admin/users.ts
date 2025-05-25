import express, { Response } from "express";
import User from "../../models/User";
import { authMiddleware, AuthenticatedRequest } from "../../middleware/auth";
import { requireAdmin } from "../../middleware/requireadmin";

const router = express.Router();

// GET /admin/users — Admin can view all users
router.get(
  "/",
  authMiddleware,
  requireAdmin,
  async (_req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const users = await User.find().select(
        "email nickname role createdAt IsBanned lastLogin"
      );
      res.json(users);
    } catch (err) {
      console.error("Failed to fetch users", err);
      res.status(500).json({ error: "Server error fetching users" });
    }
  }
);

// PATCH /admin/users/:id/ban — update IsBanned
router.patch(
  "/:id/ban",
  authMiddleware,
  requireAdmin,
  async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    const { id } = req.params;
    const { IsBanned } = req.body;
    console.log("PATCH /admin/users/:id/ban hit ✅");
    try {
      const user = await User.findByIdAndUpdate(
        id,
        { IsBanned },
        { new: true }
      );
      if (!user) {
        res.status(404).json({ error: "User not found" });
        return;
      }
      res.json(user);
    } catch (err) {
      console.error("Error banning user:", err);
      res.status(500).json({ error: "Failed to update user ban status" });
    }
  }
);

export default router;
