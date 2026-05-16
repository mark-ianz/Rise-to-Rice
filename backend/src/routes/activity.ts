import { Router } from "express";
import { handleGetUserActivity } from "../controllers/activity";
import { requireAuth } from "../middleware/authentication";

const router = Router();

// User Route to get their own activity
router.get("/user/:id", requireAuth, handleGetUserActivity);

export default router;
