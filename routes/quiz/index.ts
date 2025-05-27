import express from "express";
import random from "./random";
import submit from "./submit";
import verify from "./verify";
import scores from "./scores";
import saveScore from "./save-score";
import getQuestions from "./get-questions";

const router = express.Router();

router.use(random);
router.use(submit);
router.use(verify);
router.use(scores);
router.use(saveScore);
router.use(getQuestions);

export default router;
