import { Router } from "express";
import { getDashboardAnalytics, getMaterialsByTotalWeight, getUserAnalytics } from "../controllers/analytics";
import { requireAdmin, requireAuth } from "../middleware/authentication";

const router = Router();

router.get("/total_weight/:time/:id?", getMaterialsByTotalWeight);
router.get("/user/:time/:id?", getUserAnalytics);
router.get("/dashboard", requireAuth, requireAdmin, getDashboardAnalytics)

export default router;
