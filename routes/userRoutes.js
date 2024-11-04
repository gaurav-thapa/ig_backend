const express = require("express");
const router = express.Router();

const {
  createUser,
  loginUser,
  getUser,
  getProfile,
  saveProfile,
  toggleFollowUser,
} = require("../controllers/userController");

//route for creating user
router.post("/create", createUser);
router.post("/login", loginUser);
router.get("/get/:userID", getUser);
router.get("/profile/:username", getProfile);
router.put("/saveProfile", saveProfile);
router.post("/follow", toggleFollowUser)

module.exports = router;
