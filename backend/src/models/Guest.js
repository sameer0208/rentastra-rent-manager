import mongoose from "mongoose";

const GuestSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    phone: { type: String, required: true },

    // NEW ROOM RELATION
    room: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Room",
      required: true,
    },

    monthlyRent: { type: Number, required: true },

    exitInfo: {
      isExited: { type: Boolean, default: false },
      exitDate: Date,
      reason: String,
      finalSettlementAmount: Number,
      settledOn: Date,
    },

    policeVerification: {
      status: {
        type: String,
        enum: ["PENDING", "SUBMITTED", "VERIFIED", "REJECTED"],
        default: "PENDING",
      },
      verifiedOn: Date,
      remarks: String,
    },

    // OPTIONAL ID DETAILS (NOT REQUIRED NOW)
    idType: { type: String },
    idNumber: { type: String },
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

    documents: [
      {
        name: String,
        url: String,
      },
    ],
  },
  { timestamps: true },
);

export default mongoose.model("Guest", GuestSchema);
