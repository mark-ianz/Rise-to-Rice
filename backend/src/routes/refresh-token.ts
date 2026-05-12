import { Router } from "express";
import { validateRefreshToken } from "../controllers/refresh-token";


const router = Router();

router.post("/", validateRefreshToken);

export default router;
