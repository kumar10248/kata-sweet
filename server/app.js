const express = require("express");
const authRoutes = require("./routes/auth.routes");
const authenticate = require("./middlewares/auth.middleware");
const authorizeRole = require("./middlewares/role.middleware");

const app = express();

app.use(express.json());
app.use("/api/auth", authRoutes);

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
