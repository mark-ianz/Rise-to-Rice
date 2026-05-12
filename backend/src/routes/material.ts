import { Router } from "express";
import {
  addCategory,
  addMaterial,
  deleteCategory,
  deleteMaterial,
  getAllCategories,
  getAllMaterials,
  getSingleMaterial,
  updateMaterial,
} from "../controllers/materials";
import { requireAdmin, requireAuth } from "../middleware/authentication";

const router = Router();

// getting materials are open for everyone even if they are not logged in
// but adding, editing and deleting materials are only allowed for admins

router.get("/", getAllMaterials);
router.get("/categories", getAllCategories);
router.post("/categories", requireAuth, requireAdmin, addCategory);
router.delete("/categories/:id", requireAuth, requireAdmin, deleteCategory);
router.get("/:id", getSingleMaterial);
router.post("/", requireAuth, requireAdmin, addMaterial);
router.put("/:id", requireAuth, requireAdmin, updateMaterial);
router.delete("/:id", requireAuth, requireAdmin, deleteMaterial);

export default router;
