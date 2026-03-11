import express from "express";
import cors from "cors";
import authRoutes from "./routes/authRoutes.js";
import authMiddleware from "./middleware/authMiddleware.js";
import guestRoutes from "./routes/guestRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import documentRoutes from "./routes/documentRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";
import roomRoutes from "./routes/roomRoutes.js";
import familyRoutes from "./routes/familyRoutes.js";
import familyDocumentRoutes from "./routes/familyDocumentRoutes.js";
import receiptRoutes from "./routes/receiptRoutes.js";
import propertyRoutes from "./routes/propertyRoutes.js";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);

app.use("/api/guests", guestRoutes);

app.use("/api/payments", paymentRoutes);

app.use("/api/documents", documentRoutes);

app.use("/api/dashboard", dashboardRoutes);

app.use("/api/rooms", roomRoutes);

app.use("/api/family", familyRoutes);

app.use("/api/family-documents", familyDocumentRoutes);

app.use("/api/receipts", receiptRoutes);
app.use("/api/properties", propertyRoutes);

app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

app.use((err, req, res, next) => {
  console.error("🔥 Global error:", err);
  res.status(500).json({
    message: err.message || "Internal Server Error",
  });
});

app.get("/", (req, res) => {
  res.send("🚀 Rent Manager API is running");
});

export default app;
