import Payment from "../models/Payment.js";
import { generateMonthlyRent } from "../utils/generateMonthlyRent.js";

/**
 * GET ALL PAYMENTS (optional month filter)
 * Example: /payments?month=2026-01
 */
export const getPayments = async (req, res) => {
  try {
    await generateMonthlyRent(req.user.userId, req.propertyId);

    const filter = {
      owner: req.user.userId,
      property: req.propertyId,
    };

    if (req.query.month) filter.month = req.query.month;

    const payments = await Payment.find(filter)
      .populate({
        path: "guest",
        select: "name room",
        populate: {
          path: "room",
          select: "roomNumber",
        },
      })
      .sort({ month: -1 });

    res.json(payments);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch payments" });
  }
};

/**
 * GET PAYMENTS BY GUEST
 */
export const getPaymentsByGuest = async (req, res) => {
  try {
    const payments = await Payment.find({
      guest: req.params.guestId,
      owner: req.user.userId,
      property: req.propertyId,
    }).sort({ month: -1 });

    res.json(payments);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch guest payments" });
  }
};

/**
 * GET PENDING PAYMENTS
 */
export const getPendingPayments = async (req, res) => {
  try {
    await generateMonthlyRent(req.user.userId, req.propertyId);

    const pending = await Payment.find({
      owner: req.user.userId,
      property: req.propertyId,
      status: { $in: ["PENDING", "PARTIAL"] },
    }).populate({
      path: "guest",
      select: "name room monthlyRent",
      populate: {
        path: "room",
        select: "roomNumber",
      },
    });

    res.json(pending);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch pending payments" });
  }
};

/**
 * APPLY PAYMENT (supports partial & full payment)
 */
export const markPaymentPaid = async (req, res) => {
  try {
    const { paymentId } = req.params;
    const { amountPaid, paymentMode } = req.body;

    const payment = await Payment.findOne({
      _id: paymentId,
      owner: req.user.userId,
      property: req.propertyId,
    });

    if (!payment) {
      return res.status(404).json({ message: "Payment not found" });
    }

    payment.payments.push({
      amount: amountPaid,
      mode: paymentMode,
    });

    payment.amountPaid = (payment.amountPaid || 0) + amountPaid;

    if (payment.amountPaid >= payment.amount) {
      payment.status = "PAID";
      payment.paidDate = new Date();
    } else {
      payment.status = "PARTIAL";
    }

    await payment.save();

    res.json(payment);
  } catch (error) {
    console.error("Apply payment error:", error);
    res.status(400).json({ message: "Failed to apply payment" });
  }
};

/**
 * DELETE PAYMENT
 */
export const deletePayment = async (req, res) => {
  try {
    const payment = await Payment.findOne({
      _id: req.params.paymentId,
      owner: req.user.userId,
      property: req.propertyId,
    });

    if (!payment) {
      return res.status(404).json({ message: "Payment not found" });
    }

    if (payment.status === "PAID") {
      return res.status(400).json({
        message: "Paid payments cannot be deleted",
      });
    }

    await payment.deleteOne();

    res.json({ message: "Payment deleted successfully" });
  } catch (error) {
    console.error("Delete payment error:", error);
    res.status(500).json({ message: "Failed to delete payment" });
  }
};
