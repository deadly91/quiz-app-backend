import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import dbConnect from "../../lib/db";
import User from "../../models/User";
import { signToken } from "../../lib/auth";

export const registerHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { email, password, nickname } = req.body;

  if (!email || !password || !nickname) {
    res.status(400).json({ error: "Missing required fields" });
    return;
  }

  await dbConnect();

  const existing = await User.findOne({ email });
  if (existing) {
    res.status(400).json({ error: "User already exists" });
    return;
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await User.create({
    email,
    password: hashedPassword,
    nickname: nickname,
    role: "player",
  });

  const token = signToken(user._id.toString(), user.nickname, user.role);

  res.status(201).json({
    token,
    nickname: user.nickname, // include nickname in response
    message: "User registered successfully", // success message
    role: user.role, // include role in response
  });
};
