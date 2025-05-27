import dotenv from "dotenv";
dotenv.config();

import express from "express";
import dbConnect from "./lib/db";
import metricshandler from "./routes/user/metrics";
import { registerHandler } from "./routes/auth/register";
import { loginHandler } from "./routes/auth/login";
import adminRoutes from "./routes/admin";
import usersRoute from "./routes/admin/users";
import metricsRoute from "./routes/admin/metrics";
import questionhandler from "./routes/admin/questions/add-question";
import quizRoutes from "./routes/quiz";

const app = express();
app.use(express.json());

app.use("/api/admin/questions", questionhandler);
app.get("/api/user", metricshandler);
app.post("/api/auth/register", registerHandler);
app.post("/api/auth/login", loginHandler);
app.use("/api/admin/metrics", metricsRoute);
app.use("/api/admin/users", usersRoute);
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
