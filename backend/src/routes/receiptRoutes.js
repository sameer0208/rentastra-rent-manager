import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import propertyMiddleware from "../middleware/propertyMiddleware.js";
import { generateFinalReceipt } from "../controllers/receiptController.js";

const router = express.Router();

router.get("/final/:guestId", authMiddleware, propertyMiddleware, generateFinalReceipt);

export default router;
