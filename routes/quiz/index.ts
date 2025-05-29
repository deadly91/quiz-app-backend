import express from "express";
import random from "./random";
import submit from "./submit";
import verify from "./verify";

import saveScore from "./save-score";
import getQuestions from "./get-questions";
import scoresHandler from "./scores";
import quizhistory from "./quiz-history";
const router = express.Router();

router.use(random);
router.use(submit);
router.use(verify);
router.use(quizhistory);
router.use(saveScore);
router.use(getQuestions);
router.use(scoresHandler);

export default router;
