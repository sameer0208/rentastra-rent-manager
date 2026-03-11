import PDFDocument from "pdfkit";

export const generateFinalReceipt = ({ receiptNo, guest, payment }) => {
  const doc = new PDFDocument({ size: "A4", margin: 50 });

  /* HEADER */
  doc
    .fontSize(18)
    .text("FINAL SETTLEMENT RECEIPT", { align: "center" })
    .moveDown(0.5);

  doc
    .fontSize(10)
    .text("Sayyed Manzil Rent Manager", { align: "center" })
    .text("Owner: Sayyed Sameer Basir", { align: "center" })
    .moveDown(1);

  /* RECEIPT INFO */
  doc.fontSize(10);
  doc.text(`Receipt No: ${receiptNo}`);
  doc.text(`Date: ${new Date().toLocaleDateString()}`);
  doc.moveDown();

  /* GUEST DETAILS */
  doc.fontSize(12).text("Guest Details", { underline: true });
  doc.fontSize(10);
  doc.text(`Name: ${guest.name}`);
  doc.text(`Phone: ${guest.phone}`);
  doc.text(`Room: ${guest.room?.roomNumber}`);
  doc.moveDown();

  /* PAYMENT DETAILS */
  doc.fontSize(12).text("Settlement Details", { underline: true });
  doc.fontSize(10);
  doc.text(`Exit Month: ${payment.month}`);
  doc.text(`Settlement Amount: ₹${payment.amountPaid}`);
  doc.text(`Payment Mode: ${payment.paymentMode || "Cash"}`);
  doc.text(`Purpose: Final Settlement`);
  doc.moveDown();

  /* FOOTER */
  doc.moveDown(2);
  doc
    .fontSize(9)
    .text("This is a system-generated receipt. No signature required.", {
      align: "center",
    });

  doc
    .fontSize(8)
    .text("© Sayyed Manzil Rent Manager | v1.01-alpha", { align: "center" });

  return doc;
};
