const User = require("../models/user.model");
const Cart = require("../models/cart.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const login = async ({ body: { username, email, password } }, res) => {
  try {
    // Validate input
    if (!username && !email) {
      return res.status(400).json({ message: "Username or email is required" });
    }

    // Build query based on provided fields
    let query = {};
    if (username && email) {
      query = { $or: [{ username }, { email }] };
    } else if (username) {
      query = { username };
    } else if (email) {
      query = { email };
    }

    // Find user and populate cart (fetch password for authentication)
    const user = await User.findOne(query)
      .select("+password") // Explicitly include password for authentication
      .populate("cart", "items total"); // Populate cart details

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Verify password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Remove password before sending user data
    user.password = undefined;

    // Generate JWT token
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
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
      process.env.JWT_SECRET,
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
