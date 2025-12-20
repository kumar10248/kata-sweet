const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/auth.routes");
const sweetRoutes = require("./routes/sweet.routes");
const authenticate = require("./middlewares/auth.middleware");
const authorizeRole = require("./middlewares/role.middleware");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/health", (req, res) => {
  res.status(200).json({ status: "OK" });
});

app.use("/api/auth", authRoutes);
app.use("/api/sweets", sweetRoutes);

app.get("/api/protected", authenticate, (req, res) => {
  res.status(200).json({ message: "Protected content" });
});

app.get(
  "/api/admin",
  authenticate,
  authorizeRole("ADMIN"),
  (req, res) => res.status(200).json({ message: "Admin content" })
);

module.exports = app;
