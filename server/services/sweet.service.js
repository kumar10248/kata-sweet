const Sweet = require("../models/Sweet");

const createSweet = async (sweetData) => {
  const sweet = await Sweet.create(sweetData);
  return sweet;
};

module.exports = {
  createSweet
};
