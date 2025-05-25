import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET as string;

export function signToken(userId: string, nickname: string, role: string) {
  return jwt.sign({ userId, nickname, role }, JWT_SECRET, { expiresIn: "7d" });
}
