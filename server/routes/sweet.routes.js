const express = require("express");
const {
  createSweet,
  listSweets,
  searchSweets,
  updateSweet
} = require("../controllers/sweet.controller");
const authenticate = require("../middlewares/auth.middleware");

const router = express.Router();

router.post("/", authenticate, createSweet);
router.get("/", authenticate, listSweets);
router.get("/search", authenticate, searchSweets);
router.put("/:id", authenticate, updateSweet);

module.exports = router;
