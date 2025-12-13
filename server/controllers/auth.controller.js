const authService = require("../services/auth.service");

const registerUser = async (req, res) => {
  try {
    const user = await authService.registerUser(req.body);
    return res.status(201).json({ id: user._id });
  } catch (err) {
    return res
      .status(err.statusCode || 500)
      .json({ message: err.message });
  }
};

const loginUser = async (req, res) => {
  try {
    const result = await authService.loginUser(req.body);
    return res.status(200).json(result);
  } catch (err) {
    return res
      .status(err.statusCode || 500)
      .json({ message: err.message });
  }
};

module.exports = {
  registerUser,
  loginUser
};
