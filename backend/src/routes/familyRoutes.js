import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import propertyMiddleware from "../middleware/propertyMiddleware.js";
import {
  addFamilyMember,
  getFamilyMembers,
  updateFamilyMember,
  updateFamilyPoliceStatus,
  deleteFamilyMember,
} from "../controllers/familyController.js";

const router = express.Router();

router.use(authMiddleware);
router.use(propertyMiddleware);

router.post("/:guestId", addFamilyMember);
router.get("/:guestId", getFamilyMembers);
router.put("/member/:id", updateFamilyMember);
router.put("/member/:id/police-status", updateFamilyPoliceStatus);
router.delete("/member/:id", deleteFamilyMember);

export default router;
