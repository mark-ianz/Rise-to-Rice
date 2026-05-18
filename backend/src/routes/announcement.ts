import { Router } from "express";
import { requireAdmin, requireAuth } from "../middleware/authentication";
import {
  deleteAnnouncement,
  getAnnouncementAuthor,
  getAnnouncements,
  getSingleAnnouncement,
  postAnnouncement,
  updateAnnouncement,
} from "../controllers/announcement";
import { upload } from "../utils/multer";

const router = Router();

router.get("/get-author/:id", getAnnouncementAuthor);
router.get("/", getAnnouncements);
router.get("/:id", getSingleAnnouncement);
router.post(
  "/",
  requireAuth,
  requireAdmin,
  upload.single("image"),
  postAnnouncement
);
router.put(
  "/:id",
  requireAuth,
  requireAdmin,
  upload.single("image"),
  updateAnnouncement
);
router.delete("/:id", requireAuth, requireAdmin, deleteAnnouncement);

export default router;
