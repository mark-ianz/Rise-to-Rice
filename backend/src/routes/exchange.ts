import { Router } from "express";
import { logExchange, handleGetExchangeLogByNanoId } from "../controllers/exchange";
import { requireAdmin, requireAuth } from "../middleware/authentication";
import { upload } from "../utils/multer";

const router = Router();

router.post("/log", requireAuth, requireAdmin, upload.single("image"), logExchange);

// Specific Activity View (Publicish/Auth)
router.get("/activity/:nano_id", requireAuth, handleGetExchangeLogByNanoId);

export default router;