const Sweet = require("../models/Sweet");

const createSweet = async (data) => Sweet.create(data);

const listSweets = async () => Sweet.find();

const searchSweets = async (query) => {
  const filter = {};

  if (query.name) {
    filter.name = { $regex: query.name, $options: "i" };
  }

  if (query.category) {
    filter.category = query.category;
  }

  if (query.minPrice || query.maxPrice) {
    filter.price = {};
    if (query.minPrice) filter.price.$gte = Number(query.minPrice);
    if (query.maxPrice) filter.price.$lte = Number(query.maxPrice);
  }

  return Sweet.find(filter);
};

const updateSweet = async (id, updateData) => {
  const sweet = await Sweet.findByIdAndUpdate(
    id,
    updateData,
    { new: true }
  );

  return sweet;
};

module.exports = {
  createSweet,
  listSweets,
  searchSweets,
  updateSweet
};
