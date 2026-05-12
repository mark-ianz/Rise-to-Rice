import { Router } from "express";
import {
  handleDeleteRewardVariation,
  handleGetRewardVariation,
  handlePostRewardVariation,
  handleUpdateRewardVariation,
} from "../controllers/reward-variation";
import { requireAdmin, requireAuth } from "../middleware/authentication";

const router = Router();

router.post("/", requireAuth, requireAdmin, handlePostRewardVariation);
router.get("/:id?", requireAuth, handleGetRewardVariation);
router.put("/:id", requireAuth, requireAdmin, handleUpdateRewardVariation);
router.delete("/:id", requireAuth, requireAdmin, handleDeleteRewardVariation);

export default router;
