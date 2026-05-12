import { Router } from "express";
import { pagination } from "../controllers/test";

const router = Router();

router.get("/pagination", pagination);

export default router;