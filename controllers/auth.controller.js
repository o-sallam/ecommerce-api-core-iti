const User = require("../models/auth.model");
const bcrypt = require("bcryptjs");

const login = async ({ body }, res) => {
  res.status(200).json(name);
};

const register = async (req, res) => {
  const { username, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = new User({ username, password: hashedPassword });
  await user.save();
  res.status(201).json({ message: "User registered successfully" });
};

const getUsers = async (req, res) => {
  const users = await User.find();
  res.status(200).json(users);
};

module.exports = {
  login,
  register,
  getUsers,
};
