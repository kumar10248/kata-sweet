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
    const result = await sweetService.listSweets(req.query);
    return res.status(200).json(result);
  } catch {
    return res.status(500).json({ message: "Failed to fetch sweets" });
  }
};


const searchSweets = async (req, res) => {
  try {
    const result = await sweetService.searchSweets(req.query);
    return res.status(200).json(result);
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

const deleteSweet = async (req, res) => {
  try {
    const sweet = await sweetService.deleteSweet(req.params.id);

    if (!sweet) {
      return res.status(404).json({ message: "Sweet not found" });
    }

    return res.status(200).json({ message: "Sweet deleted" });
  } catch {
    return res.status(500).json({ message: "Failed to delete sweet" });
  }
};

const purchaseSweet = async (req, res) => {
  try {
    const sweet = await sweetService.purchaseSweet(req.params.id);
    return res.status(200).json(sweet);
  } catch (err) {
    return res
      .status(err.statusCode || 500)
      .json({ message: err.message });
  }
};


const restockSweet = async (req, res) => {
  try {
    const quantity = parseInt(req.body.quantity) || 1;
    const sweet = await sweetService.restockSweet(req.params.id, quantity);
    return res.status(200).json(sweet);
  } catch (err) {
    return res
      .status(err.statusCode || 500)
      .json({ message: err.message });
  }
};


module.exports = {
  createSweet,
  listSweets,
  searchSweets,
  updateSweet,
  deleteSweet,
  purchaseSweet,
  restockSweet
};
