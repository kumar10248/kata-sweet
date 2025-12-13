const bcrypt = require("bcrypt");
const User = require("../models/User");

const registerUser = async (req, res) => {
  const { password, ...rest } = req.body;

  // Check if email already exists
  const existingUser = await User.findOne({ email: rest.email });
  if (existingUser) {
    return res.status(409).json({ message: "Email already registered" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await User.create({
    ...rest,
    password: hashedPassword,
  });

  return res.status(201).json({ id: user._id });
};

module.exports = { registerUser };
