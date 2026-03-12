import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    // BASIC INFO
    fullName: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    phone: {
      type: String,
      required: true,
    },

    password: {
      type: String,
      required: true,
    },

    // ROLE SYSTEM
    role: {
      type: String,
      enum: ["OWNER", "MANAGER", "STAFF"],
      default: "OWNER",
    },

    // BUSINESS INFO (profile display; kept in sync with primaryProperty in Property table)
    propertyName: {
      type: String,
      required: true,
    },

    propertyAddress: {
      type: String,
    },

    country: { type: String, trim: true, default: "" },
    state: { type: String, trim: true, default: "" },
    city: { type: String, trim: true, default: "" },
    pincode: { type: String, trim: true, default: "" },

    /** Links to the Property created at registration; profile name/address edits update this Property */
    primaryProperty: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Property",
      default: null,
    },

    // ACCOUNT CONTROL
    isActive: {
      type: Boolean,
      default: true,
    },

    isVerified: {
      type: Boolean,
      default: false,
    },

    lastLogin: {
      type: Date,
    },

    passwordChangedAt: {
      type: Date,
    },

    loginAttempts: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true },
);

const User = mongoose.model("User", userSchema);
export default User;