import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import propertyMiddleware from "../middleware/propertyMiddleware.js";
import {
  addRoom,
  getRooms,
  updateRoom,
  deleteRoom,
} from "../controllers/roomController.js";

const router = express.Router();

router.post("/", authMiddleware, propertyMiddleware, addRoom);
router.get("/", authMiddleware, propertyMiddleware, getRooms);
router.put("/:id", authMiddleware, propertyMiddleware, updateRoom);
router.delete("/:id", authMiddleware, propertyMiddleware, deleteRoom);

export default router;
