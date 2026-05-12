import { Router } from "express";
import { checkUser, loginUser, logoutUser } from "../controllers/auth";

const router = Router();

router.post("/login", loginUser);
router.post("/logout", logoutUser);
router.get("/check", checkUser);

export default router;
