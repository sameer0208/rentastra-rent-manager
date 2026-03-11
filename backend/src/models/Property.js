import mongoose from "mongoose";

const propertySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    address: { type: String, default: "" },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

propertySchema.index({ owner: 1, name: 1 });

export default mongoose.model("Property", propertySchema);
