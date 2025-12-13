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

const deleteSweet = async (id) => {
  return Sweet.findByIdAndDelete(id);
};

const purchaseSweet = async (id) => {
  const sweet = await Sweet.findById(id);

  if (!sweet) {
    const error = new Error("Sweet not found");
    error.statusCode = 404;
    throw error;
  }

  if (sweet.quantity <= 0) {
    const error = new Error("Out of stock");
    error.statusCode = 400;
    throw error;
  }

  sweet.quantity -= 1;
  await sweet.save();

  return sweet;
};


const restockSweet = async (id) => {
  const sweet = await Sweet.findById(id);

  if (!sweet) {
    const error = new Error("Sweet not found");
    error.statusCode = 404;
    throw error;
  }

  sweet.quantity += 1;
  await sweet.save();

  return sweet;
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
