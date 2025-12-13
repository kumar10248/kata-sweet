const sweetService = require("../services/sweet.service");

const createSweet = async (req, res) => {
  try {
    const sweet = await sweetService.createSweet(req.body);
    return res.status(201).json(sweet);
  } catch {
    return res.status(500).json({ message: "Failed to create sweet" });
  }
};

const listSweets = async (req, res) => {
  try {
    const sweets = await sweetService.listSweets();
    return res.status(200).json(sweets);
  } catch {
    return res.status(500).json({ message: "Failed to fetch sweets" });
  }
};

const searchSweets = async (req, res) => {
  try {
    const sweets = await sweetService.searchSweets(req.query);
    return res.status(200).json(sweets);
  } catch {
    return res.status(500).json({ message: "Search failed" });
  }
};

module.exports = {
  createSweet,
  listSweets,
  searchSweets
};
