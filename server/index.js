
import connectDB from "./config/db.js";
import "dotenv/config";
import express from "express";

const app = express();

const PORT = process.env.PORT || 8000;

app.use(express.json());

app.get("/", (req, res) => {
  res.json("Hello World");
});

const startServer = async () => {
  try {
    await connectDB();

    app.listen(PORT, () => {
      console.log(`Kata Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1); 
  }
};

startServer();

