const express = require("express");
const { createSweet } = require("../controllers/sweet.controller");
const authenticate = require("../middlewares/auth.middleware");

const router = express.Router();

router.post("/", authenticate, createSweet);

module.exports = router;
