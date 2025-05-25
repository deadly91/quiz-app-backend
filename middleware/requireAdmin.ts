import { Request, Response, NextFunction } from "express";
import User from "../models/User";
import { AuthenticatedRequest } from "./auth";

export const requireAdmin = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const user = await User.findById(req.userId);
    if (!user || user.role !== "admin") {
      res.status(403).json({ error: "Forbidden: Admins only" });
      return;
    }
    next();
  } catch (err) {
    res.status(500).json({ error: "Internal error" });
  }
};
