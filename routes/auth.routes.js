const authController = require("../controllers/auth.controller");
const userController = require("../controllers/users.controller");
const express = require("express");
const router = express.Router();

router.post("/login", authController.login);
router.post("/register", authController.register);
router.get("/users", userController.getUsers);

module.exports = router;
