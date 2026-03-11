import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
  {
    guest: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Guest",
      required: true,
    },

    month: {
      type: String, // e.g. "2026-01"
      required: true,
    },

    amount: {
      type: Number,
      required: true,
    },

    amountPaid: {
      type: Number,
      default: 0,
    },

    status: {
      type: String,
      enum: ["PAID", "PENDING", "PARTIAL", "CANCELLED"], // ✅ FIXED
      default: "PENDING",
    },

    paidDate: {
      type: Date,
    },

    purpose: {
      type: String,
      enum: ["RENT", "ADVANCE", "FINAL_SETTLEMENT"], // ✅ already correct
      default: "RENT",
    },

    isFinalSettlement: {
      type: Boolean,
      default: false,
    },

    paymentMode: {
      type: String, // Optional summary field
    },

    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    property: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Property",
      default: null,
    },

    payments: [
      {
        amount: { type: Number, required: true },
        mode: {
          type: String,
          enum: ["Cash", "UPI", "Net Banking"], // ✅ DO NOT PUT "Final Settlement" HERE
          required: true,
        },
        date: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true },
);

// One payment per guest per month
paymentSchema.index({ guest: 1, month: 1 }, { unique: true });

const Payment = mongoose.model("Payment", paymentSchema);
export default Payment;
