import Guest from "../models/Guest.js";
import Payment from "../models/Payment.js";
import Property from "../models/Property.js";

export const generateFinalReceipt = async (req, res) => {
  try {
    const { guestId } = req.params;

    const guest = await Guest.findOne({
      _id: guestId,
      owner: req.user.userId,
      property: req.propertyId,
    }).populate("room");
    if (!guest) {
      return res.status(404).send("Guest not found");
    }

    const payment = await Payment.findOne({
      guest: guestId,
      owner: req.user.userId,
      isFinalSettlement: true,
    });

    if (!payment) {
      return res.status(404).send("Final settlement not found");
    }

    const prop = await Property.findById(req.propertyId).select("name");
    const propertyName = prop?.name || "";

    res.setHeader("Content-Type", "text/html");

    res.send(`
      <html>
        <head>
          <title>Final Settlement Receipt</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              padding: 40px;
              background: #f8fafc;
            }
            .receipt {
              max-width: 700px;
              margin: auto;
              background: white;
              padding: 30px;
              border-radius: 8px;
              box-shadow: 0 10px 25px rgba(0,0,0,0.1);
            }
            h1 {
              text-align: center;
              color: #4f46e5;
            }
            .property-name {
              text-align: center;
              font-size: 14px;
              color: #475569;
              margin-top: 4px;
            }
            .row {
              margin: 10px 0;
            }
            .label {
              font-weight: bold;
            }
            .footer {
              margin-top: 30px;
              text-align: center;
              font-size: 12px;
              color: #64748b;
            }
          </style>
        </head>
        <body>
          <div class="receipt">
          
            <h1>Final Settlement Receipt</h1>
            ${propertyName ? `<p class="property-name">${propertyName}</p>` : ""}

            <div class="row"><span class="label">Guest:</span> ${
              guest.name
            }</div>
            <div class="row"><span class="label">Room:</span> ${
              guest.room?.roomNumber
            }</div>
            <div class="row"><span class="label">Phone:</span> ${
              guest.phone
            }</div>
            <div class="row"><span class="label">Exit Date:</span> ${new Date(
              guest.exitInfo.exitDate
            ).toDateString()}</div>

            <hr />

            <div class="row"><span class="label">Settlement Amount:</span> ₹${
              payment.amountPaid
            }</div>
            <div class="row"><span class="label">Paid On:</span> ${new Date(
              payment.paidDate
            ).toDateString()}</div>
            <div class="row"><span class="label">Payment Mode:</span> ${
              payment.payments?.[0]?.mode || "N/A"
            }</div>

            <div class="footer">
              <p>This is a system-generated receipt.</p>
              <p>Sayyed Manzil Rent Manager • v1.01-alpha</p>
            </div>
          </div>
        </body>
      </html>
    `);
  } catch (error) {
    console.error("Final receipt error:", error);
    res.status(500).send("Failed to generate receipt");
  }
};
