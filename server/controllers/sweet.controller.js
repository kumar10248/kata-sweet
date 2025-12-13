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

const updateSweet = async (req, res) => {
  try {
    const sweet = await sweetService.updateSweet(
      req.params.id,
      req.body
    );

    if (!sweet) {
      return res.status(404).json({ message: "Sweet not found" });
    }

    return res.status(200).json(sweet);
  } catch {
    return res.status(500).json({ message: "Failed to update sweet" });
  }
};


module.exports = {
  createSweet,
  listSweets,
  searchSweets,
  updateSweet
};
