import Room from "../models/Room.js";

/* ---------------- CREATE ROOM ---------------- */
export const addRoom = async (req, res) => {
  try {
    const { roomNumber, floor, rent } = req.body;

    const room = await Room.create({
      roomNumber,
      floor,
      rent,
      owner: req.user.userId,
      property: req.propertyId,
    });

    res.status(201).json(room);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: "Room already exists" });
    }

    res.status(400).json({ message: "Failed to add room" });
  }
};

/* ---------------- GET ALL ROOMS ---------------- */
export const getRooms = async (req, res) => {
  try {
    const rooms = await Room.find({
      owner: req.user.userId,
      property: req.propertyId,
    }).sort({ floor: 1, roomNumber: 1 });

    res.json(rooms);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch rooms" });
  }
};

/* ---------------- UPDATE ROOM ---------------- */
export const updateRoom = async (req, res) => {
  try {
    const updatedRoom = await Room.findOneAndUpdate(
      {
        _id: req.params.id,
        owner: req.user.userId,
        property: req.propertyId,
      },
      req.body,
      { new: true },
    );

    if (!updatedRoom) {
      return res.status(404).json({ message: "Room not found" });
    }

    res.json(updatedRoom);
  } catch (error) {
    res.status(400).json({ message: "Failed to update room" });
  }
};

/* ---------------- DELETE ROOM ---------------- */
export const deleteRoom = async (req, res) => {
  try {
    const room = await Room.findOne({
      _id: req.params.id,
      owner: req.user.userId,
      property: req.propertyId,
    });

    if (!room) {
      return res.status(404).json({ message: "Room not found" });
    }

    if (room.isOccupied) {
      return res.status(400).json({ message: "Cannot delete occupied room" });
    }

    await room.deleteOne();

    res.json({ message: "Room deleted successfully" });
  } catch (error) {
    res.status(400).json({ message: "Failed to delete room" });
  }
};
