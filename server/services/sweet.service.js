const Sweet = require("../models/Sweet");

const createSweet = async (data) => Sweet.create(data);

const listSweets = async (query = {}) => {
  const { page, limit, skip } = getPagination(query);

  const [data, total] = await Promise.all([
    Sweet.find().skip(skip).limit(limit),
    Sweet.countDocuments()
  ]);

  return {
    data,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit)
    }
  };
};


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

  const { page, limit, skip } = getPagination(query);

  const [data, total] = await Promise.all([
    Sweet.find(filter).skip(skip).limit(limit),
    Sweet.countDocuments(filter)
  ]);

  return {
    data,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit)
    }
  };
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

const getPagination = (query) => {
  const page = Math.max(parseInt(query.page) || 1, 1);
  const limit = Math.max(parseInt(query.limit) || 10, 1);
  const skip = (page - 1) * limit;
  return { page, limit, skip };
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
