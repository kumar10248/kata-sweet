const Sweet = require("../models/Sweet");

const createSweet = async (sweetData) => {
  return Sweet.create(sweetData);
};

const listSweets = async () => {
  return Sweet.find();
};

module.exports = {
  createSweet,
  listSweets
};
