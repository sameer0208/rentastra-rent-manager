import Payment from "../models/Payment.js";
import Guest from "../models/Guest.js";

/**
 * Ensure a PENDING payment exists for the current month for each active guest
 * owned by the user in the given property. Idempotent (upsert).
 * @param {string} userId - owner (logged-in user id)
 * @param {string} propertyId - property to scope to
 */
export const generateMonthlyRent = async (userId, propertyId) => {
  const now = new Date();
  const month = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(
    2,
    "0"
  )}`;

  const guests = await Guest.find({
    owner: userId,
    property: propertyId,
    $or: [{ "exitInfo.isExited": false }, { exitInfo: { $exists: false } }],
  });

  for (const guest of guests) {
    try {
      await Payment.updateOne(
        { guest: guest._id, month },
        {
          $setOnInsert: {
            guest: guest._id,
            month,
            amount: guest.monthlyRent,
            amountPaid: 0,
            status: "PENDING",
            owner: userId,
            property: propertyId,
          },
        },
        { upsert: true }
      );
    } catch (err) {
      if (err.code === 11000) continue;
      throw err;
    }
  }
};
