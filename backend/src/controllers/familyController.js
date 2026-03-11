import FamilyMember from "../models/FamilyMember.js";
import Guest from "../models/Guest.js";

/* ADD FAMILY MEMBER */
export const addFamilyMember = async (req, res) => {
  try {
    const guest = await Guest.findOne({
      _id: req.params.guestId,
      owner: req.user.userId,
      property: req.propertyId,
    });
    if (!guest) {
      return res.status(404).json({ message: "Guest not found" });
    }

    const member = await FamilyMember.create({
      guest: guest._id,
      ...req.body,
    });

    res.status(201).json(member);
  } catch (error) {
    res.status(400).json({ message: "Failed to add family member" });
  }
};

/* GET FAMILY MEMBERS BY GUEST */
export const getFamilyMembers = async (req, res) => {
  try {
    const guest = await Guest.findOne({
      _id: req.params.guestId,
      owner: req.user.userId,
      property: req.propertyId,
    });
    if (!guest) {
      return res.status(404).json({ message: "Guest not found" });
    }
    const members = await FamilyMember.find({
      guest: req.params.guestId,
      isActive: true,
    }).sort({ createdAt: -1 });

    res.json(members);
  } catch {
    res.status(500).json({ message: "Failed to fetch family members" });
  }
};

/* UPDATE FAMILY MEMBER */
export const updateFamilyMember = async (req, res) => {
  try {
    const member = await FamilyMember.findById(req.params.id).populate("guest");
    if (!member) {
      return res.status(404).json({ message: "Family member not found" });
    }
    const guest = await Guest.findOne({
      _id: member.guest._id,
      owner: req.user.userId,
      property: req.propertyId,
    });
    if (!guest) {
      return res.status(404).json({ message: "Guest not found" });
    }
    const updated = await FamilyMember.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(updated);
  } catch {
    res.status(400).json({ message: "Failed to update family member" });
  }
};

/* UPDATE FAMILY POLICE STATUS */
export const updateFamilyPoliceStatus = async (req, res) => {
  try {
    const { status, remarks } = req.body;

    const member = await FamilyMember.findById(req.params.id).populate("guest");
    if (!member) {
      return res.status(404).json({ message: "Family member not found" });
    }
    const guest = await Guest.findOne({
      _id: member.guest._id,
      owner: req.user.userId,
      property: req.propertyId,
    });
    if (!guest) {
      return res.status(404).json({ message: "Guest not found" });
    }

    member.policeVerification.status = status;
    member.policeVerification.remarks = remarks;

    if (status === "VERIFIED") {
      member.policeVerification.verifiedOn = new Date();
    } else {
      member.policeVerification.verifiedOn = null;
    }

    await member.save();
    res.json(member);
  } catch {
    res.status(400).json({ message: "Failed to update police status" });
  }
};

/* SOFT DELETE FAMILY MEMBER */
export const deleteFamilyMember = async (req, res) => {
  try {
    const member = await FamilyMember.findById(req.params.id).populate("guest");
    if (!member) {
      return res.status(404).json({ message: "Family member not found" });
    }
    const guest = await Guest.findOne({
      _id: member.guest._id,
      owner: req.user.userId,
      property: req.propertyId,
    });
    if (!guest) {
      return res.status(404).json({ message: "Guest not found" });
    }
    await FamilyMember.findByIdAndUpdate(req.params.id, {
      isActive: false,
    });
    res.json({ message: "Family member removed" });
  } catch {
    res.status(400).json({ message: "Failed to delete family member" });
  }
};
