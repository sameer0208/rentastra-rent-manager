import Property from "../models/Property.js";

/**
 * Reads propertyId from query (?propertyId=) or header (X-Property-Id).
 * Validates it belongs to req.user.userId and sets req.propertyId.
 * If not provided, fetches user's first property and sets req.propertyId (for backward compat).
 */
export default async function propertyMiddleware(req, res, next) {
  try {
    const propertyId = req.query.propertyId || req.headers["x-property-id"];

    if (propertyId) {
      const property = await Property.findOne({
        _id: propertyId,
        owner: req.user.userId,
      });
      if (!property) {
        return res.status(403).json({ message: "Invalid or unauthorized property" });
      }
      req.propertyId = propertyId;
      return next();
    }

    const first = await Property.findOne({ owner: req.user.userId }).sort({ createdAt: 1 });
    if (!first) {
      return res.status(400).json({
        message: "No property found. Create a property first or refresh the page.",
      });
    }
    req.propertyId = first._id.toString();
    next();
  } catch (error) {
    return res.status(500).json({ message: "Failed to resolve property" });
  }
}
