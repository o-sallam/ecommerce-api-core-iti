const authController = require("../controllers/auth.controller");
const express = require("express");
const router = express.Router();

router.post("/login", authController.login);
router.post("/register", authController.register);
router.get("/users", authController.getUsers);

module.exports = router;
