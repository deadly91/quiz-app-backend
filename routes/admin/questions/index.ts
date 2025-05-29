import express from "express";
import addQuestionHandler from "../questions/add-question";
import deleteQuestionHandler from "../questions/delete-question";

import getQuestionsHandler from "../questions/get-questions";

const router = express.Router();

// Mount at /api/admin/questions → should load GET, POST, DELETE
router.use("/", getQuestionsHandler); // handles GET /
router.use("/", addQuestionHandler); // handles POST /
router.use("/", deleteQuestionHandler); // handles DELETE /:id

export default router;
