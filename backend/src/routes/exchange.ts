import { Router } from "express";
import { logExchange } from "../controllers/exchange";
import { requireAdmin, requireAuth } from "../middleware/authentication";

const router = Router();

router.post("/log", requireAuth, requireAdmin, logExchange);

export default router;