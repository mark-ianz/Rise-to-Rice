import { Router } from "express";
import {
  handleContactMessageStatusUpdate,
  handleContactMessageStatusUpdateDelete,
  handleGetAllContactMessages,
  handlePostContactUs,
} from "../controllers/contact-us";

const router = Router();

router.post("/", handlePostContactUs);
router.get("/", handleGetAllContactMessages);
router.put("/:id", handleContactMessageStatusUpdate)
router.delete("/:id", handleContactMessageStatusUpdateDelete)

export default router;
