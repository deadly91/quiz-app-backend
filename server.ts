import dotenv from "dotenv";
dotenv.config();

import express from "express";
import dbConnect from "./lib/db";
import { registerHandler } from "./routes/auth/register";
import { loginHandler } from "./routes/auth/login";
import adminRoutes from "./routes/admin";
import adminusersRoute from "./routes/admin/users";
import quizRoutes from "./routes/quiz";
import userRoutes from "./routes/user";
const app = express();
app.use(express.json());

app.use("/api/user", userRoutes);
app.post("/api/auth/register", registerHandler);
app.post("/api/auth/login", loginHandler);
app.use("/api/admin/users", adminusersRoute);
app.use("/api/admin", adminRoutes);
app.use("/api/quiz", quizRoutes);

app.get("/", (req, res) => {
  res.send("Backend is working!");
  console.log(req.statusCode);
  console.log(req.statusMessage);
});
app.listen(3001, async () => {
  await dbConnect();
  console.log("🚀 Server running on http://localhost:3001");
});
