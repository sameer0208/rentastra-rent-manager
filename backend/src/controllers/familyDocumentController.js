import cloudinary from "../config/cloudinary.js";
import Guest from "../models/Guest.js";
import FamilyDocument from "../models/FamilyDocument.js";
import FamilyMember from "../models/FamilyMember.js";

const ensureMemberOwnedByUser = async (memberId, userId, propertyId) => {
  const member = await FamilyMember.findById(memberId).populate("guest");
  if (!member) return null;
  const guest = await Guest.findOne({
    _id: member.guest._id,
    owner: userId,
    $or: [{ property: propertyId }, { property: null }],
  });
  return guest ? member : null;
};

export const uploadFamilyDocument = async (req, res) => {
  try {
    if (!req.file || !req.file.buffer) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const member = await ensureMemberOwnedByUser(
      req.params.memberId,
      req.user.userId,
      req.propertyId
    );
    if (!member) {
      return res.status(404).json({ message: "Family member not found" });
    }

    const documentType = req.body.documentType;
    if (!documentType) {
      return res.status(400).json({ message: "Document type is required" });
    }

    const uploadPromise = new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: `rent-manager/family/${member.guest._id}`,
          resource_type: "auto",
        },
        (error, result) => {
          if (error) return reject(error);
          if (!result) return reject(new Error("No upload result"));
          resolve(result);
        }
      );
      uploadStream.end(req.file.buffer);
    });

    const result = await uploadPromise;

    const doc = await FamilyDocument.create({
      familyMember: member._id,
      documentType,
      documentNumber: req.body.documentNumber || "",
      fileUrl: result.secure_url,
      cloudinaryId: result.public_id,
    });

    res.status(201).json(doc);
  } catch (error) {
    console.error("Family document upload error:", error);
    res.status(400).json({
      message: error.message || "Document upload failed",
    });
  }
};

export const getFamilyDocuments = async (req, res) => {
  const member = await ensureMemberOwnedByUser(
    req.params.memberId,
    req.user.userId,
    req.propertyId
  );
  if (!member) {
    return res.status(404).json({ message: "Family member not found" });
  }
  const docs = await FamilyDocument.find({
    familyMember: req.params.memberId,
  }).sort({ createdAt: -1 });

  res.json(docs);
};

export const deleteFamilyDocument = async (req, res) => {
  try {
    const doc = await FamilyDocument.findById(req.params.id).populate({
      path: "familyMember",
      populate: { path: "guest" },
    });
    if (!doc) {
      return res.status(404).json({ message: "Document not found" });
    }
    const guest = await Guest.findOne({
      _id: doc.familyMember.guest._id,
      owner: req.user.userId,
      property: req.propertyId,
    });
    if (!guest) {
      return res.status(404).json({ message: "Document not found" });
    }

    // 🔥 Delete from Cloudinary
    if (doc.cloudinaryId) {
      await cloudinary.uploader.destroy(doc.cloudinaryId);
    }

    // ❌ Hard delete from DB
    await FamilyDocument.findByIdAndDelete(req.params.id);

    res.json({ message: "Document permanently deleted" });
  } catch (error) {
    console.error("Delete document error:", error);
    res.status(400).json({ message: "Failed to delete document" });
  }
};
