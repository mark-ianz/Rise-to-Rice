import { Router } from "express";
import {
  handleDeleteRedeemRequest,
  handleGetAllRedeemRequests,
  handleGetAllRedeemRequestsByUser,
  handleGetRedeemRequest,
  handlePostRedeemRequest,
  handleStatusUpdate,
  handleCancelStatusUser,
  handleGetRedeemRequestByNanoId
} from "../controllers/redeem-request";
import { requireAdmin, requireAuth } from "../middleware/authentication";

const router = Router();

// This route is for user to create a redeem request
router.post("/", handlePostRedeemRequest);

// Specific Activity View (Publicish/Auth)
router.get("/activity/:nano_id", requireAuth, handleGetRedeemRequestByNanoId);

// User Route
router.get("/user/:id", requireAuth, handleGetAllRedeemRequestsByUser); // Get all user redeem requests
router.put("/cancel/:id", requireAuth, handleCancelStatusUser); // Cancel redeem request

// This route is for admin to get all redeem requests
router.get("/", requireAdmin, handleGetAllRedeemRequests);
router.get("/:id", requireAdmin, handleGetRedeemRequest);
router.delete("/:id", requireAdmin, handleDeleteRedeemRequest);
router.put("/status/:id", requireAdmin, handleStatusUpdate);

export default router;
