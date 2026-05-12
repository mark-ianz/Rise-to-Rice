import { Router } from "express";
import { handleDeleteReaction, handleGetReactions, handleGetUsersWhoReacted, handlePostReact } from "../controllers/reactions";

const router = Router();

router.post("/", handlePostReact);
router.get("/users/:announcement_id", handleGetUsersWhoReacted);
router.get("/:announcement_id", handleGetReactions);
router.delete("/:reaction_id", handleDeleteReaction);

export default router;