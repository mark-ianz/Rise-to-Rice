import { Router } from "express";
import {
  handleDeleteReward,
  handleGetRewards,
  handlePostReward,
  handleUpdateReward,
} from "../controllers/reward";
import { requireAdmin, requireAuth } from "../middleware/authentication";

const router = Router();

router.post("/", requireAuth, requireAdmin, handlePostReward);
router.get("/:id?", requireAuth, handleGetRewards);
router.put("/:id", requireAuth, requireAdmin, handleUpdateReward);
router.delete("/:id", requireAuth, requireAdmin, handleDeleteReward);

export default router;
