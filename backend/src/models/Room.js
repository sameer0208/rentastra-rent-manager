import mongoose from "mongoose";

const roomSchema = new mongoose.Schema(
  {
    roomNumber: {
      type: String,
      required: true,
      trim: true,
    },
    floor: {
      type: Number,
      required: true,
    },
    rent: {
      type: Number,
      required: true,
    },
    isOccupied: {
      type: Boolean,
      default: false,
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
  },
  { timestamps: true },
);

roomSchema.index({ property: 1, roomNumber: 1 }, { unique: true });

export default mongoose.model("Room", roomSchema);
