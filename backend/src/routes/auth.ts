import { Router } from "express";
import { checkUser, loginUser, logoutUser } from "../controllers/auth";
import { validateRefreshToken } from "../controllers/refresh-token";

const router = Router();

router.post("/login", loginUser);
router.post("/logout", logoutUser);
router.get("/check", checkUser, validateRefreshToken);

export default router;
