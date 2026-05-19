import { Router } from "express";
import { handleDeleteReaction, handleGetReactions, handleGetUsersWhoReacted, handlePostReact } from "../controllers/reactions";
import { requireAuth } from "../middleware/authentication";

const router = Router();

router.post("/", requireAuth, handlePostReact);
router.get("/users/:announcement_id", handleGetUsersWhoReacted);
router.get("/:announcement_id", handleGetReactions);
router.delete("/:reaction_id", requireAuth, handleDeleteReaction);

export default router;