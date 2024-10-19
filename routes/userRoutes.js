const express = require("express");
const router = express.Router();

const {
  createUser,
  loginUser,
  getUser,
  getProfile,
} = require("../controllers/userController");

//route for creating user
router.post("/create", createUser);
router.post("/login", loginUser);
router.get("/get/:userID", getUser);
router.get("/profile/:userID", getProfile);

module.exports = router;
