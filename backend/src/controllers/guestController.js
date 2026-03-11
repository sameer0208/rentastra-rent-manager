import Guest from "../models/Guest.js";
import Payment from "../models/Payment.js";
import Room from "../models/Room.js";

/* ---------------- ADD GUEST ---------------- */
export const addGuest = async (req, res) => {
  try {
    const { name, phone, roomId } = req.body;

    if (!name || !phone || !roomId) {
      return res.status(400).json({
        message: "Name, phone and room are required",
      });
    }

    const phoneDigits = String(phone).replace(/\D/g, "");
    if (phoneDigits.length !== 10) {
      return res.status(400).json({
        message: "Mobile number must be exactly 10 digits",
      });
    }

    const room = await Room.findOne({
      _id: roomId,
      owner: req.user.userId,
      property: req.propertyId,
    });

    if (!room) {
      return res.status(404).json({ message: "Room not found" });
    }

    if (room.isOccupied) {
      return res.status(400).json({ message: "Room already occupied" });
    }

    const guest = await Guest.create({
      name,
      phone,
      room: room._id,
      monthlyRent: room.rent,
      owner: req.user.userId,
      property: req.propertyId,
    });

    room.isOccupied = true;
    await room.save();

    // Create PENDING payment for current month so it appears in Payments and dashboard
    const now = new Date();
    const month = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(
      2,
      "0"
    )}`;
    await Payment.create({
      guest: guest._id,
      month,
      amount: room.rent,
      amountPaid: 0,
      status: "PENDING",
      owner: req.user.userId,
      property: req.propertyId,
    });

    res.status(201).json(guest);
  } catch (error) {
    console.error("Add guest error:", error);
    res.status(400).json({
      message: error.message || "Failed to add guest",
    });
  }
};

/* ---------------- GET ALL GUESTS ---------------- */
export const getGuests = async (req, res) => {
  try {
    const guests = await Guest.find({
      owner: req.user.userId,
      property: req.propertyId,
    })
      .populate("room", "roomNumber floor rent")
      .sort({ createdAt: -1 });

    res.json(guests);
  } catch {
    res.status(500).json({ message: "Failed to fetch guests" });
  }
};

/* ---------------- GET ONE GUEST (for Family page etc.) ---------------- */
export const getGuestById = async (req, res) => {
  try {
    const guest = await Guest.findOne({
      _id: req.params.id,
      owner: req.user.userId,
      property: req.propertyId,
    }).populate("room", "roomNumber floor rent");

    if (!guest) {
      return res.status(404).json({ message: "Guest not found" });
    }

    res.json(guest);
  } catch {
    res.status(500).json({ message: "Failed to fetch guest" });
  }
};

/* ---------------- UPDATE GUEST ---------------- */
export const updateGuest = async (req, res) => {
  try {
    const { name, phone } = req.body;
    if (phone !== undefined) {
      const phoneDigits = String(phone).replace(/\D/g, "");
      if (phoneDigits.length !== 10) {
        return res.status(400).json({
          message: "Mobile number must be exactly 10 digits",
        });
      }
    }
    const updatedGuest = await Guest.findOneAndUpdate(
      {
        _id: req.params.id,
        owner: req.user.userId,
        property: req.propertyId,
      },
      req.body,
      { new: true }
    );

    res.json(updatedGuest);
  } catch {
    res.status(400).json({ message: "Failed to update guest" });
  }
};

/* ---------------- DELETE GUEST ---------------- */
export const deleteGuest = async (req, res) => {
  try {
    const guest = await Guest.findOne({
      _id: req.params.id,
      owner: req.user.userId,
      property: req.propertyId,
    });

    if (!guest) {
      return res.status(404).json({ message: "Guest not found" });
    }

    await Room.findOneAndUpdate(
      { _id: guest.room, owner: req.user.userId, property: req.propertyId },
      { isOccupied: false }
    );

    await Guest.deleteOne({ _id: guest._id });

    res.json({ message: "Guest deleted successfully" });
  } catch {
    res.status(400).json({ message: "Failed to delete guest" });
  }
};

/* ---------------- GET GUESTS WITH BALANCE ---------------- */
export const getGuestsWithBalance = async (req, res) => {
  try {
    const now = new Date();
    const month = `${now.getFullYear()}-${String(
      now.getMonth() + 1
    ).padStart(2, "0")}`;

    const guests = await Guest.find({
      owner: req.user.userId,
      $and: [
        { property: req.propertyId },
        { $or: [{ "exitInfo.isExited": false }, { exitInfo: { $exists: false } }] },
      ],
    })
      .populate("room", "roomNumber rent floor")
      .sort({ createdAt: -1 });

    const payments = await Payment.find({
      owner: req.user.userId,
      property: req.propertyId,
      month,
    });

    const paymentMap = {};
    payments.forEach((p) => {
      paymentMap[p.guest.toString()] = p;
    });

    const result = guests.map((guest) => {
      const payment = paymentMap[guest._id.toString()];

      const rent = guest.room?.rent ?? guest.monthlyRent;
      const paid = payment?.amountPaid ?? 0;
      const remaining = rent - paid;

      return {
        ...guest.toObject(),
        remaining,
        paymentStatus: payment?.status || "PENDING",
      };
    });

    res.json(result);
  } catch (error) {
    console.error("Guest balance error:", error);
    res.status(500).json({ message: "Failed to fetch guest balances" });
  }
};

/* ---------------- CHANGE GUEST ROOM ---------------- */
export const changeGuestRoom = async (req, res) => {
  try {
    const { id } = req.params;
    const { roomId } = req.body;

    const guest = await Guest.findOne({
      _id: id,
      owner: req.user.userId,
      property: req.propertyId,
    });

    if (!guest) {
      return res.status(404).json({ message: "Guest not found" });
    }

    const newRoom = await Room.findOne({
      _id: roomId,
      owner: req.user.userId,
      property: req.propertyId,
    });

    if (!newRoom) {
      return res.status(404).json({ message: "Room not found" });
    }

    if (newRoom.isOccupied) {
      return res.status(400).json({ message: "Room already occupied" });
    }

    if (guest.room) {
      await Room.findOneAndUpdate(
        { _id: guest.room, owner: req.user.userId, property: req.propertyId },
        { isOccupied: false }
      );
    }

    guest.room = newRoom._id;
    guest.monthlyRent = newRoom.rent;
    await guest.save();

    newRoom.isOccupied = true;
    await newRoom.save();

    res.json({
      message: "Room changed successfully",
      guest,
    });
  } catch (error) {
    console.error("Change room error:", error);
    res.status(500).json({ message: "Failed to change room" });
  }
};

/* ---------------- UPDATE POLICE STATUS ---------------- */
export const updateGuestPoliceStatus = async (req, res) => {
  try {
    const { status, remarks } = req.body;

    const guest = await Guest.findOne({
      _id: req.params.id,
      owner: req.user.userId,
      property: req.propertyId,
    });

    if (!guest) {
      return res.status(404).json({ message: "Guest not found" });
    }

    guest.policeVerification.status = status;
    guest.policeVerification.remarks = remarks || "";

    if (status === "VERIFIED") {
      guest.policeVerification.verifiedOn = new Date();
    } else {
      guest.policeVerification.verifiedOn = null;
    }

    await guest.save();
    res.json(guest);
  } catch {
    res.status(400).json({ message: "Failed to update police status" });
  }
};

/* ---------------- VACATE GUEST ---------------- */
export const vacateGuest = async (req, res) => {
  try {
    const { exitDate, reason, finalPayment, paymentMode = "Cash" } = req.body;

    const guest = await Guest.findOne({
      _id: req.params.id,
      owner: req.user.userId,
      property: req.propertyId,
    }).populate("room");

    if (!guest) {
      return res.status(404).json({ message: "Guest not found" });
    }

    if (guest.exitInfo?.isExited) {
      return res.status(400).json({ message: "Guest already vacated" });
    }

    const exitMonth = exitDate.slice(0, 7);

    await Payment.updateMany(
      {
        owner: req.user.userId,
        property: req.propertyId,
        guest: guest._id,
        month: { $gt: exitMonth },
        status: { $ne: "PAID" },
      },
      { status: "CANCELLED" }
    );

    let settlement = await Payment.findOne({
      owner: req.user.userId,
      property: req.propertyId,
      guest: guest._id,
      month: exitMonth,
    });

    if (settlement) {
      settlement.amount = finalPayment;
      settlement.amountPaid = finalPayment;
      settlement.status = "PAID";
      settlement.purpose = "FINAL_SETTLEMENT";
      settlement.isFinalSettlement = true;
      settlement.paymentMode = paymentMode;
      settlement.paidDate = new Date();
      settlement.payments = [
        { amount: finalPayment, mode: paymentMode },
      ];

      await settlement.save();
    } else {
      settlement = await Payment.create({
        owner: req.user.userId,
        property: req.propertyId,
        guest: guest._id,
        month: exitMonth,
        amount: finalPayment,
        amountPaid: finalPayment,
        status: "PAID",
        purpose: "FINAL_SETTLEMENT",
        isFinalSettlement: true,
        paidDate: new Date(),
        paymentMode,
        payments: [
          { amount: finalPayment, mode: paymentMode },
        ],
      });
    }

    if (guest.room?._id) {
      await Room.findOneAndUpdate(
        { _id: guest.room._id, owner: req.user.userId, property: req.propertyId },
        { isOccupied: false }
      );
    }

    guest.exitInfo = {
      isExited: true,
      exitDate,
      reason,
      finalSettlementAmount: finalPayment,
      settledOn: new Date(),
    };

    await guest.save();

    res.json({
      message: "Guest vacated successfully",
      settlementId: settlement._id,
    });
  } catch (error) {
    console.error("Vacate guest error:", error);
    res.status(500).json({ message: "Failed to vacate guest" });
  }
};

/* ---------------- GET VACATED GUESTS ---------------- */
export const getVacatedGuests = async (req, res) => {
  try {
    const guests = await Guest.find({
      owner: req.user.userId,
      property: req.propertyId,
      "exitInfo.isExited": true,
    })
      .populate("room")
      .sort({ "exitInfo.exitDate": -1 });

    res.json(guests);
  } catch {
    res.status(500).json({ message: "Failed to fetch vacated guests" });
  }
};

/* ---------------- UNDO VACATE ---------------- */
export const undoVacateGuest = async (req, res) => {
  try {
    const guest = await Guest.findOne({
      _id: req.params.id,
      owner: req.user.userId,
      property: req.propertyId,
    }).populate("room");

    if (!guest || !guest.exitInfo?.isExited) {
      return res.status(400).json({ message: "Guest is not vacated" });
    }

    await Payment.deleteOne({
      owner: req.user.userId,
      property: req.propertyId,
      guest: guest._id,
      isFinalSettlement: true,
    });

    if (guest.room) {
      await Room.findOneAndUpdate(
        { _id: guest.room._id, owner: req.user.userId, property: req.propertyId },
        { isOccupied: true }
      );
    }

    guest.exitInfo = { isExited: false };
    await guest.save();

    res.json({ message: "Guest restored successfully" });
  } catch {
    res.status(500).json({ message: "Undo vacate failed" });
  }
};