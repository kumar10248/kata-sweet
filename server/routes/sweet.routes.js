const express = require("express");
const {
  createSweet,
  listSweets
} = require("../controllers/sweet.controller");
const authenticate = require("../middlewares/auth.middleware");

const router = express.Router();

router.post("/", authenticate, createSweet);
router.get("/", authenticate, listSweets);

module.exports = router;
