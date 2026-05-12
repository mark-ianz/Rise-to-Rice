import { Router } from "express";
import { getMyPoints, getUserPoints, manipulateUserPoints } from "../controllers/points";
import { requireAdmin } from "../middleware/authentication";

const router = Router();

router.get("/", getMyPoints)
router.get("/:id", requireAdmin, getUserPoints);

// this route allows admin to manipulate user points in only one endpoint
router.post("/manipulate_user_points", manipulateUserPoints);

export default router;
