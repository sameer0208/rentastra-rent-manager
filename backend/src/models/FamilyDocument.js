import mongoose from "mongoose";

const familyDocumentSchema = new mongoose.Schema({
  familyMember: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "FamilyMember",
    required: true,
  },
  documentType: {
    type: String,
    enum: ["AADHAAR", "PAN", "PASSPORT", "VOTER_ID", "PHOTOGRAPH"],
    required: true,
  },
  documentNumber: String,
  fileUrl: { type: String, required: true },
  cloudinaryId: String,

  isActive: { type: Boolean, default: true },
  uploadedAt: { type: Date, default: Date.now },
});

export default mongoose.model("FamilyDocument", familyDocumentSchema);
