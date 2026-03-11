import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import propertyMiddleware from "../middleware/propertyMiddleware.js";
import upload from "../middleware/uploadMiddleware.js";
import { uploadDocument, getGuestDocuments, deleteDocument } from "../controllers/documentController.js";

const router = express.Router();

router.post(
  "/:guestId",
  authMiddleware,
  propertyMiddleware,
  upload.single("document"),
  uploadDocument
);

router.get(
  "/:guestId",
  authMiddleware,
  propertyMiddleware,
  getGuestDocuments
);

router.delete(
  "/:guestId",
  authMiddleware,
  propertyMiddleware,
  deleteDocument
);

export default router;