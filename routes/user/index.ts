import express from "express";
import profileHandler from "./profile";
import changePasswordHandler from "./change-password";

const router = express.Router();

router.use(profileHandler); // GET /api/user/profile
router.use(changePasswordHandler); // POST /api/user/change-password
export default router;
