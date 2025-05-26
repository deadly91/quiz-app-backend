import dotenv from "dotenv";
dotenv.config();

import express from "express";
import dbConnect from "./lib/db";
import metricshandler from "./routes/user/metrics";
import { registerHandler } from "./routes/auth/register";
import { loginHandler } from "./routes/auth/login";
import saveScoreHandler from "./routes/quiz/save-score";
import getQuestionsHandler from "./routes/quiz/get-questions";
import getScoresHandler from "./routes/quiz/scores";
import adminRoutes from "./routes/admin";
import usersRoute from "./routes/admin/users";
import metricsRoute from "./routes/admin/metrics";
import questionhandler from "./routes/admin/questions/add-question";
import submitQuizRoute from "./routes/quiz/submit";
import quizRandom from "./routes/quiz/random";
import quizVerify from "./routes/quiz/verify";

const app = express();
app.use(express.json());
app.use("/api/quiz", quizRandom); // GET /api/quiz/random
app.use("/api/quiz", quizVerify); // POST /api/quiz/verify
app.use("/api/quiz/submit", submitQuizRoute);
app.use("/api/admin/questions", questionhandler);
app.get("/api/user", metricshandler);
app.post("/api/auth/register", registerHandler);
app.post("/api/auth/login", loginHandler);
app.post("/api/quiz/save-score", saveScoreHandler);
app.get("/api/quiz/get-questions", getQuestionsHandler);
app.use("/api/admin/metrics", metricsRoute);
app.use("/api/admin/users", usersRoute);
app.use("/api/admin", adminRoutes);
app.use("/api/quiz", getScoresHandler);

app.get("/", (req, res) => {
  res.send("Backend is working!");
  console.log(req.statusCode);
  console.log(req.statusMessage);
});
app.listen(3001, async () => {
  await dbConnect();
  console.log("🚀 Server running on http://localhost:3001");
});
