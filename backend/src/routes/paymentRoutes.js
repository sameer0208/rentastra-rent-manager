import express from "express";
import {
  getPayments,
  getPaymentsByGuest,
  getPendingPayments,
  deletePayment,
} from "../controllers/paymentController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import propertyMiddleware from "../middleware/propertyMiddleware.js";
import { markPaymentPaid } from "../controllers/paymentController.js";

const router = express.Router();

router.use(authMiddleware);
router.use(propertyMiddleware);

router.get("/", getPayments);
router.get("/guest/:guestId", getPaymentsByGuest);
router.get("/pending", getPendingPayments);
router.put("/:paymentId/pay", markPaymentPaid);
router.delete("/:paymentId", deletePayment);

export default router;
