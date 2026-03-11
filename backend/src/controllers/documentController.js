import Guest from "../models/Guest.js";
import cloudinary from "../config/cloudinary.js";

// UPLOAD DOCUMENT
export const uploadDocument = async (req, res) => {
  try {
    const { guestId } = req.params;
    const { documentName } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const guest = await Guest.findOne({
      _id: guestId,
      owner: req.user.userId,
      property: req.propertyId,
    });
    if (!guest) {
      return res.status(404).json({ message: "Guest not found" });
    }

    guest.documents.push({
      name: documentName,
      url: req.file.path
    });

    await guest.save();

    res.json({
      message: "Document uploaded successfully",
      document: {
        name: documentName,
        url: req.file.path
      }
    });
  } catch (error) {
    console.error("❌ Document upload error:", error);
  return res.status(500).json({
    message: "Document upload failed",
    error: error.message || error
  });

  }
};

// GET DOCUMENTS FOR A GUEST
export const getGuestDocuments = async (req, res) => {
  try {
    const { guestId } = req.params;

    const guest = await Guest.findOne({
      _id: guestId,
      owner: req.user.userId,
      property: req.propertyId,
    })
      .select("name room documents")
      .populate("room", "roomNumber");

    if (!guest) {
      return res.status(404).json({ message: "Guest not found" });
    }

    res.json({
      guest: {
        name: guest.name,
        roomNumber: guest.room?.roomNumber,
      },
      documents: guest.documents,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch documents" });
  }
};

// DELETE DOCUMENT
export const deleteDocument = async (req, res) => {
  try {
    const { guestId } = req.params;
    const { url } = req.body;

    const guest = await Guest.findOne({
      _id: guestId,
      owner: req.user.userId,
      property: req.propertyId,
    });
    if (!guest) {
      return res.status(404).json({ message: "Guest not found" });
    }

    // Extract public_id from Cloudinary URL
    const publicId = url
      .split("/")
      .slice(-2)
      .join("/")
      .split(".")[0];

    await cloudinary.uploader.destroy(publicId);

    guest.documents = guest.documents.filter(doc => doc.url !== url);
    await guest.save();

    res.json({ message: "Document deleted successfully" });
  } catch (error) {
    console.error("Delete document error:", error);
    res.status(500).json({ message: "Failed to delete document" });
  }
};