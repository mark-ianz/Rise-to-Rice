import { Router } from "express";
import {
  changePassword,
  checkEmailExists,
  createUser,
  deleteUser,
  getAccountInfo,
  getAllUser,
  requestVerificationCode,
  resetPassword,
  searchForUser,
  updateUserInfo,
  updateUserRole,
  verifyVerificationCode,
  updatePreferredLanguage,
} from "../controllers/user";
import {
  requireAdmin,
  requireAuth,
  requireSelf,
  requireSelfOrAdmin,
  requireSuperAdmin,
} from "../middleware/authentication";

const router = Router();

router.get("/", requireAuth, requireAdmin, getAllUser);
router.put("/reset-password", resetPassword);
router.put("/preferred-language", requireAuth, updatePreferredLanguage);
router.put("/change-password/:id", requireAuth, requireSelf, changePassword);
router.post("/verification-code/request", requestVerificationCode);
router.post("/verification-code/verify", verifyVerificationCode);
router.post("/email-exists", checkEmailExists);
router.get("/search", requireAuth, requireAdmin, searchForUser);
router.post("/create", createUser);
router.put(
  "/update_role/:id/:role_id",
  requireAuth,
  requireSuperAdmin,
  updateUserRole
);
router.get("/:id", requireAuth, requireSelfOrAdmin, getAccountInfo);
router.put("/:id", requireAuth, requireSelfOrAdmin, updateUserInfo);
router.delete("/:id", requireAuth, requireSuperAdmin, deleteUser);

export default router;
