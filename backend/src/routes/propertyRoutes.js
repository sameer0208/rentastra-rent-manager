import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import {
  listProperties,
  createProperty,
  getProperty,
  updateProperty,
  deleteProperty,
} from "../controllers/propertyController.js";

const router = express.Router();

router.use(authMiddleware);

router.get("/", listProperties);
router.post("/", createProperty);
router.post("/:id/delete", deleteProperty);
router.get("/:id", getProperty);
router.put("/:id", updateProperty);
router.delete("/:id", deleteProperty);

export default router;
