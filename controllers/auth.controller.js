const User = require("../models/user.model");
const Cart = require("../models/cart.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const login = async ({ body: { username, password } }, res) => {
  try {
    // Find user and populate cart
    const user = await User.findOne({ username })
      .select("-password") // Exclude password from the result
      .populate("cart", "items total"); // Populate cart details

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Verify password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET || "dfgsgfsdlkdlsajfklhhewqs",
      { expiresIn: "100h" }
    );

    // Return user data with token (excluding password)
    const { password: _, ...userData } = user.toObject();

    res.status(200).json({
      message: "Login successful",
      token,
      user: userData,
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      message: "Error during login",
      error: error.message,
    });
  }
};

const register = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    // Check if user already exists
    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      return res.status(400).json({
        message: "User already exists with this username or email",
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = new User({
      username,
      email,
      password: hashedPassword,
      role: "user", // Default role
    });

    // Save user
    await user.save();

    // Create a new cart for the user
    const cart = new Cart({
      user: user._id,
      items: [],
      total: 0,
    });

    // Save cart
    await cart.save();

    // Update user with cart reference
    user.cart = cart._id;
    await user.save();

    // Generate JWT token
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET || "dfgsgfsdlkdlsajfklhhewqs",
      { expiresIn: "1h" }
    );

    // Return success response with token and user info (excluding password)
    const { password: _, ...userData } = user.toObject();

    res.status(201).json({
      message: "User registered successfully",
      token,
      user: userData,
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({
      message: "Error registering user",
      error: error.message,
    });
  }
};

module.exports = {
  login,
  register,
};
