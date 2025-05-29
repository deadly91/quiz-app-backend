import express from "express";
import { authMiddleware, AuthenticatedRequest } from "../../middleware/auth";
import User from "../../models/User";
import bcrypt from "bcryptjs";

const router = express.Router();

router.post(
  "/change-password",
  authMiddleware,
  async (req: AuthenticatedRequest, res): Promise<void> => {
    const { oldPassword, newPassword } = req.body;

    if (!oldPassword || !newPassword) {
      res.status(400).json({ error: "Old and new password required" });
      return;
    }

    try {
      const user = await User.findById(req.userId);
      if (!user) {
        res.status(404).json({ error: "User not found" });
        return;
      }
      const isMatch = await bcrypt.compare(oldPassword, user.password);
      if (!isMatch) {
        res.status(401).json({ error: "Incorrect current password" });
        return;
      }

      const hashed = await bcrypt.hash(newPassword, 10);
      user.password = hashed;
      await user.save();

      res.json({ message: "Password changed successfully" });
    } catch (err) {
      console.error("Change password error:", err);
      res.status(500).json({ error: "Failed to change password" });
    }
  }
);

export default router;
