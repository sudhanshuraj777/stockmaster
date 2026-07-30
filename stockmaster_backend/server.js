import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";

// Import routes
import authRoutes from "./routes/authRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import warehouseRoutes from "./routes/warehouseRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import receiptRoutes from "./routes/receiptRoutes.js";
import deliveryRoutes from "./routes/deliveryRoutes.js";
import transferRoutes from "./routes/transferRoutes.js";
import adjustmentRoutes from "./routes/adjustmentRoutes.js";
import ledgerRoutes from "./routes/ledgerRoutes.js";

dotenv.config();
const app = express();

// Connect DB (Moved to top to prevent routing errors during initialization)
connectDB();

// Middleware
const allowedOrigins = [
  "http://localhost:5173", // Standard Vite development port
  process.env.FRONTEND_URL  // Your production frontend URL (e.g., Vercel/Netlify link)
].filter(Boolean); // Dynamically removes undefined values if FRONTEND_URL isn't set yet

app.use(cors({
  origin: function (origin, callback) {
    // Allow server-to-server requests, Postman, or mobile apps (no origin header)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true // Set to true to support secure cookies, tokens, and sessions
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Base Route
app.get("/", (req, res) => {
  res.json({ 
    message: "StockMaster API is running...",
    version: "1.0.0"
  });
});

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/warehouses", warehouseRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/receipts", receiptRoutes);
app.use("/api/deliveries", deliveryRoutes);
app.use("/api/transfers", transferRoutes);
app.use("/api/adjustments", adjustmentRoutes);
app.use("/api/ledger", ledgerRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error("Error:", err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal server error",
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || "development"}`);
});