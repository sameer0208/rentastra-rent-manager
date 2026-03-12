import User from "../models/User.js";
import Property from "../models/Property.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const register = async (req, res) => {
  try {
    const { fullName, email, phone, password, propertyName, propertyAddress, country, state, city, pincode } =
      req.body;

    if (!fullName || !email || !phone || !password || !propertyName) {
      return res.status(400).json({ message: "All required fields missing" });
    }

    const phoneDigits = String(phone).replace(/\D/g, "");
    if (phoneDigits.length !== 10) {
      return res.status(400).json({ message: "Mobile number must be exactly 10 digits" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const trimmedName = (propertyName && String(propertyName).trim()) || "My Property";
    const trimmedAddress = propertyAddress != null ? String(propertyAddress).trim() : "";

    const user = await User.create({
      fullName,
      email,
      phone,
      password: hashedPassword,
      propertyName: trimmedName,
      propertyAddress: trimmedAddress,
      country: country != null ? String(country).trim() : "",
      state: state != null ? String(state).trim() : "",
      city: city != null ? String(city).trim() : "",
      pincode: pincode != null ? String(pincode).trim().replace(/\D/g, "").slice(0, 10) : "",
    });

    const createdProperty = await Property.create({
      name: trimmedName,
      address: trimmedAddress,
      owner: user._id,
    });

    user.primaryProperty = createdProperty._id;
    await user.save({ validateBeforeSave: true });

    res.status(201).json({ message: "Account created successfully" });
  } catch (error) {
    res.status(500).json({ message: "Registration failed" });
  }
};
// LOGIN
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.json({
      message: "Login successful",
      token,
    });
  } catch (error) {
    res.status(500).json({ message: "Login failed" });
  }
};

/** GET current user profile (for View Profile page) */
export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select(
      "-password -loginAttempts -passwordChangedAt"
    );
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const payload = user.toObject ? user.toObject() : { ...user };
    payload.country = payload.country ?? "";
    payload.state = payload.state ?? "";
    payload.city = payload.city ?? "";
    payload.pincode = payload.pincode ?? "";
    res.json(payload);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch profile" });
  }
};

/** PUT update profile (fullName, phone, propertyName, propertyAddress only; email not editable). Optional propertyId syncs that property's name/address. */
export const updateProfile = async (req, res) => {
  try {
    const { fullName, phone, propertyName, propertyAddress, propertyId, country, state, city, pincode } = req.body || {};
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    if (fullName !== undefined && fullName !== null) {
      const trimmed = String(fullName).trim();
      if (!trimmed) return res.status(400).json({ message: "Full name is required" });
      user.fullName = trimmed;
    }
    if (phone !== undefined && phone !== null) {
      const phoneDigits = String(phone).replace(/\D/g, "");
      if (phoneDigits.length !== 10) {
        return res.status(400).json({ message: "Mobile number must be exactly 10 digits" });
      }
      user.phone = phoneDigits;
    }
    if (propertyName !== undefined && propertyName !== null) {
      const trimmed = String(propertyName).trim();
      if (!trimmed) return res.status(400).json({ message: "Property name is required" });
      user.propertyName = trimmed;
    }
    if (propertyAddress !== undefined) user.propertyAddress = propertyAddress == null ? "" : String(propertyAddress).trim();
    if (country !== undefined) user.country = country == null ? "" : String(country).trim();
    if (state !== undefined) user.state = state == null ? "" : String(state).trim();
    if (city !== undefined) user.city = city == null ? "" : String(city).trim();
    if (pincode !== undefined) user.pincode = pincode == null ? "" : String(pincode).replace(/\D/g, "").slice(0, 10);
    await user.save();

    let propToSync = null;
    if (user.primaryProperty) {
      propToSync = await Property.findOne({ _id: user.primaryProperty, owner: user._id });
    }
    if (!propToSync && propertyId) {
      propToSync = await Property.findOne({ _id: propertyId, owner: user._id });
      if (propToSync) {
        user.primaryProperty = propToSync._id;
        await user.save();
      }
    }
    if (!propToSync) {
      propToSync = await Property.findOne({ owner: user._id }).sort({ createdAt: 1 });
      if (propToSync) {
        user.primaryProperty = propToSync._id;
        await user.save();
      }
    }
    if (propToSync) {
      propToSync.name = user.propertyName;
      propToSync.address = user.propertyAddress || "";
      await propToSync.save();
    }

    const updated = await User.findById(user._id).select(
      "-password -loginAttempts -passwordChangedAt"
    );
    if (!updated) return res.status(500).json({ message: "Failed to return updated profile" });
    const payload = updated.toObject ? updated.toObject() : { ...updated };
    payload.country = payload.country ?? "";
    payload.state = payload.state ?? "";
    payload.city = payload.city ?? "";
    payload.pincode = payload.pincode ?? "";
    res.json(payload);
  } catch (error) {
    const message = error.message || "Failed to update profile";
    return res.status(500).json({ message });
  }
};
