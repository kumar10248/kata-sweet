const express = require("express");
const {
  createSweet,
  listSweets,
  searchSweets,
  updateSweet,
  deleteSweet,
  purchaseSweet,
  restockSweet
} = require("../controllers/sweet.controller");

const authenticate = require("../middlewares/auth.middleware");
const authorizeRole = require("../middlewares/role.middleware");

const router = express.Router();

router.post("/", authenticate, createSweet);
router.get("/", authenticate, listSweets);
router.get("/search", authenticate, searchSweets);
router.put("/:id", authenticate, updateSweet);
router.delete("/:id", authenticate, authorizeRole("ADMIN"), deleteSweet);
router.post("/:id/purchase", authenticate, purchaseSweet);
router.post("/:id/restock", authenticate, authorizeRole("ADMIN"), restockSweet);



module.exports = router;
