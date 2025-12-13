const sweetService = require("../services/sweet.service");

const createSweet = async (req, res) => {
  try {
    const sweet = await sweetService.createSweet(req.body);
    return res.status(201).json(sweet);
  } catch (err) {
    return res.status(500).json({ message: "Failed to create sweet" });
  }
};

module.exports = {
  createSweet
};
