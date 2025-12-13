const bcrypt = require("bcrypt");
const User = require("../models/User");

const registerUser = async (req, res) => {
  const { password, ...rest } = req.body;

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await User.create({
    ...rest,
    password: hashedPassword,
  });

  return res.status(201).json({ id: user._id });
};

module.exports = { registerUser };
