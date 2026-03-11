import Guest from "../models/Guest.js";
import Payment from "../models/Payment.js";

export const getDashboardSummary = async (req, res) => {
  try {
    const now = new Date();
    const month =
      req.query.month ||
      `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;

    const totalGuests = await Guest.countDocuments({
      owner: req.user.userId,
      $and: [
        { property: req.propertyId },
        { $or: [{ "exitInfo.isExited": false }, { exitInfo: { $exists: false } }] },
      ],
    });

    const roomsOccupied = totalGuests;

    const payments = await Payment.find({
      owner: req.user.userId,
      property: req.propertyId,
      month,
    });

    let totalCollected = 0;
    let totalPending = 0;
    let pendingCount = 0;

    payments.forEach((payment) => {
      // FULLY PAID
      if (payment.status === "PAID") {
        totalCollected += payment.amount;
      }

      // PARTIAL PAYMENT
      if (payment.status === "PARTIAL") {
        totalCollected += payment.amountPaid || 0;
        totalPending += payment.amount - (payment.amountPaid || 0);
        pendingCount++;
      }

      // NOT PAID AT ALL
      if (payment.status === "PENDING") {
        totalPending += payment.amount;
        pendingCount++;
      }
    });

    res.json({
      month,
      totalGuests,
      roomsOccupied,
      totalCollected,
      totalPending,
      pendingCount,
    });
  } catch (error) {
    console.error("Dashboard error:", error);
    res.status(500).json({ message: "Failed to load dashboard summary" });
  }
};

export const getLatePaymentSummary = async (req, res) => {
  try {
    const now = new Date();
    const currentMonth = `${now.getFullYear()}-${String(
      now.getMonth() + 1
    ).padStart(2, "0")}`;

    const latePayments = await Payment.find({
      owner: req.user.userId,
      property: req.propertyId,
      month: { $lt: currentMonth },
      status: { $ne: "PAID" },
    }).populate({
      path: "guest",
      select: "name monthlyRent",
      populate: { path: "room", select: "roomNumber" },
    });

    let lateAmount = 0;

    const details = latePayments.map((p) => {
      const remaining = p.amount - (p.amountPaid || 0);
      lateAmount += remaining;

      return {
        guestName: p.guest?.name,
        roomNumber: p.guest?.room?.roomNumber,
        month: p.month,
        remaining,
        status: p.status,
      };
    });

    res.json({
      lateCount: latePayments.length,
      lateAmount,
      details,
    });
  } catch (error) {
    console.error("Late payment summary error:", error);
    res.status(500).json({ message: "Failed to load late payment summary" });
  }
};
