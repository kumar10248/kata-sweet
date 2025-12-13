const registerUser = (req, res) => {
  return res.status(201).json({ message: "User registered" });
};

module.exports = { registerUser };
