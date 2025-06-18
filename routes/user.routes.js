const express = require("express");
const router = express.Router();
const userController = require("../controllers/users.controller");
const { permit } = require("../middlewares/role.middleware");

// Only 'admin' and 'user' roles can access this endpoint
router.get("/", permit('admin', 'user'), userController.getUsers);

module.exports = router;
