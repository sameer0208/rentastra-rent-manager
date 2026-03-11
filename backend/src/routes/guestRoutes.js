import express from "express";
import {
  addGuest,
  getGuests,
  getGuestById,
  updateGuest,
  deleteGuest,
  changeGuestRoom,
  updateGuestPoliceStatus,
  vacateGuest,
  getVacatedGuests,
  undoVacateGuest,
} from "../controllers/guestController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import propertyMiddleware from "../middleware/propertyMiddleware.js";
import { getGuestsWithBalance } from "../controllers/guestController.js";

const router = express.Router();

router.use(authMiddleware);
router.use(propertyMiddleware);

router.post("/", addGuest);
router.get("/", getGuests);
router.get("/with-balance", getGuestsWithBalance);
router.get("/vacated", getVacatedGuests);
router.get("/:id", getGuestById);
router.put("/:id", updateGuest);
router.delete("/:id", deleteGuest);
router.put("/:id/change-room", changeGuestRoom);
router.put("/:id/police-status", updateGuestPoliceStatus);
router.post("/:id/vacate", vacateGuest);
router.put("/:id/undo-vacate", undoVacateGuest);

export default router;
