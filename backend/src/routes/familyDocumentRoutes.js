import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import propertyMiddleware from "../middleware/propertyMiddleware.js";
import {
  uploadFamilyDocument,
  getFamilyDocuments,
  deleteFamilyDocument,
} from "../controllers/familyDocumentController.js";
import { upload } from "../middleware/multer.js";

const router = express.Router();

router.use(authMiddleware);
router.use(propertyMiddleware);

router.post("/:memberId", upload.single("document"), uploadFamilyDocument);
router.get("/:memberId", getFamilyDocuments);
router.delete("/:id", deleteFamilyDocument);

export default router;
