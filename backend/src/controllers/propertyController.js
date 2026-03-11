import mongoose from "mongoose";
import Property from "../models/Property.js";
import User from "../models/User.js";
import Guest from "../models/Guest.js";
import Room from "../models/Room.js";
import Payment from "../models/Payment.js";

/** GET all properties for the current user. If none exist, create one from User and migrate existing data. */
export const listProperties = async (req, res) => {
  try {
    const userId = req.user.userId;
    let properties = await Property.find({ owner: userId }).sort({ createdAt: 1 });

    if (properties.length === 0) {
      const user = await User.findById(userId);
      if (!user) return res.status(404).json({ message: "User not found" });
      const created = await Property.create({
        name: user.propertyName || "My Property",
        address: user.propertyAddress || "",
        owner: userId,
      });
      await Guest.updateMany({ owner: userId, property: null }, { property: created._id });
      await Room.updateMany({ owner: userId, property: null }, { property: created._id });
      await Payment.updateMany({ owner: userId, property: null }, { property: created._id });
      user.primaryProperty = created._id;
      await user.save();
      properties = await Property.find({ owner: userId }).sort({ createdAt: 1 });
    } else {
      const firstId = properties[0]._id;
      await Guest.updateMany({ owner: userId, property: null }, { property: firstId });
      await Room.updateMany({ owner: userId, property: null }, { property: firstId });
      await Payment.updateMany({ owner: userId, property: null }, { property: firstId });
      const user = await User.findById(userId);
      if (user && !user.primaryProperty) {
        user.primaryProperty = firstId;
        await user.save();
      }
    }

    res.json(properties);
  } catch (error) {
    console.error("List properties error:", error);
    res.status(500).json({ message: "Failed to fetch properties" });
  }
};

/** POST create a new property */
export const createProperty = async (req, res) => {
  try {
    const { name, address } = req.body || {};
    const trimmedName = name != null ? String(name).trim() : "";
    if (!trimmedName) return res.status(400).json({ message: "Property name is required" });

    const property = await Property.create({
      name: trimmedName,
      address: address != null ? String(address).trim() : "",
      owner: req.user.userId,
    });
    res.status(201).json(property);
  } catch (error) {
    res.status(500).json({ message: "Failed to create property" });
  }
};

/** GET single property (must belong to user) */
export const getProperty = async (req, res) => {
  try {
    const property = await Property.findOne({
      _id: req.params.id,
      owner: req.user.userId,
    });
    if (!property) return res.status(404).json({ message: "Property not found" });
    res.json(property);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch property" });
  }
};

/** PUT update property */
export const updateProperty = async (req, res) => {
  try {
    const { name, address } = req.body || {};
    const property = await Property.findOne({
      _id: req.params.id,
      owner: req.user.userId,
    });
    if (!property) return res.status(404).json({ message: "Property not found" });
    if (name !== undefined) property.name = String(name).trim() || property.name;
    if (address !== undefined) property.address = String(address).trim();
    await property.save();
    res.json(property);
  } catch (error) {
    res.status(500).json({ message: "Failed to update property" });
  }
};

/** DELETE property (only if no guests/rooms). User must own the property. */
export const deleteProperty = async (req, res) => {
  try {
    const rawId = req.params.id;
    if (!rawId || !mongoose.Types.ObjectId.isValid(rawId)) {
      return res.status(400).json({ message: "Invalid property id" });
    }
    const propertyId = new mongoose.Types.ObjectId(rawId);

    const property = await Property.findOne({
      _id: propertyId,
      owner: req.user.userId,
    });
    if (!property) {
      return res.status(404).json({ message: "Property not found" });
    }

    const guestCount = await Guest.countDocuments({ property: propertyId });
    const roomCount = await Room.countDocuments({ property: propertyId });
    if (guestCount > 0 || roomCount > 0) {
      return res.status(400).json({
        message: "Cannot delete property that has guests or rooms. Remove or move them first.",
      });
    }

    await Payment.deleteMany({ property: propertyId });
    await Property.findByIdAndDelete(propertyId);
    return res.json({ message: "Property deleted" });
  } catch (error) {
    console.error("Delete property error:", error);
    return res.status(500).json({ message: "Failed to delete property" });
  }
};
