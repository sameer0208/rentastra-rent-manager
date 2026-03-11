import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import propertyMiddleware from "../middleware/propertyMiddleware.js";
import { getDashboardSummary, getLatePaymentSummary } from "../controllers/dashboardController.js";

const router = express.Router();

router.get("/summary", authMiddleware, propertyMiddleware, getDashboardSummary);
router.get("/late-summary", authMiddleware, propertyMiddleware, getLatePaymentSummary);

export default router;