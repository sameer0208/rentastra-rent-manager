import mongoose from "mongoose";

const familyMemberSchema = new mongoose.Schema(
  {
    guest: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Guest",
      required: true,
    },

    name: { type: String, required: true },
    relation: { type: String, required: true },
    age: Number,
    phone: String,

    policeVerification: {
      status: {
        type: String,
        enum: ["PENDING", "SUBMITTED", "VERIFIED", "REJECTED"],
        default: "PENDING",
      },
      verifiedOn: Date,
      remarks: String,
    },

    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.model("FamilyMember", familyMemberSchema);
