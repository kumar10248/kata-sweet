const express = require("express");
const cors = require("cors");
const authRoutes = require("./routes/auth.routes");
const authenticate = require("./middlewares/auth.middleware");
const authorizeRole = require("./middlewares/role.middleware");
const sweetRoutes = require("./routes/sweet.routes");

const app = express();

// Enable CORS for all routes
app.use(cors({
  origin: 'http://localhost:5173'
}));

app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/sweets", sweetRoutes);

// Protected test route
app.get("/api/protected", authenticate, (req, res) => {
  res.status(200).json({ message: "Protected content" });
});

// ADMIN-only route
app.get(
  "/api/admin",
  authenticate,
  authorizeRole("ADMIN"),
  (req, res) => {
    res.status(200).json({ message: "Admin content" });
  }
);

module.exports = app;
