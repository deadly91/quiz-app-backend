import express from "express";
import metricsRouter from "./metrics";
import usersRouter from "./users";
import questionsRouter from "./questions";

const router = express.Router();
router.use("/questions", questionsRouter);

// Mount /api/admin/users/*
router.use("/users", usersRouter);

// Mount /api/admin/metrics/*
router.use("/metrics", metricsRouter);

export default router;
