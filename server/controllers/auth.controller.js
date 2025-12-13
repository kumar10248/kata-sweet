const User = require("../models/User");

const registerUser = async (req, res) => {
  const user = await User.create(req.body);
  return res.status(201).json({ id: user._id });
};

module.exports = { registerUser };
