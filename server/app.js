const express = require("express");
const authRoutes = require("./routes/auth.routes");
const authenticate = require("./middlewares/auth.middleware");

const app = express();

app.use(express.json());
app.use("/api/auth", authRoutes);

// Test protected route
app.get("/api/protected", authenticate, (req, res) => {
  res.status(200).json({ message: "Protected content" });
});

module.exports = app;
