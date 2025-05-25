import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import dbConnect from "../../lib/db";
import User from "../../models/User";
import { signToken } from "../../lib/auth";

export const loginHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400).json({ error: "Missing fields" });
    return;
  }
  await dbConnect();

  const user = await User.findOne({ email });
  if (user.IsBanned) {
    res.status(403).json({
      error: "Your account has been banned please contact admin.",
    });
    return;
  }

  if (!user) {
    res.status(401).json({ error: "Invalid email or password" });
    return;
  }

  user.lastLogin = new Date();
  await user.save();

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    res.status(401).json({ error: "Invalid email or password" });
    return;
  }
  const token = signToken(user._id.toString(), user.nickname, user.role);
  res.status(200).json({
    token,
    nickname: user.nickname, // include it in login response
    message: "Login successful", // success message
    role: user.role, // include role in response
  });
};
