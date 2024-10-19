const {
  getUserByUserID,
  insertNewUser,
  getUserProfile,
  logUserIn,
} = require("../models/userModel");

const createUser = async (req, res) => {
  const { identifier, username, name, password } = req.body;
  if (
    identifier.trim() !== "" &&
    username.trim() !== "" &&
    name.trim() !== "" &&
    password.trim() !== ""
  ) {
    try {
      await insertNewUser(req.body);
      res.status(200).json("USER CREATED");
    } catch (error) {
      res.status(500).json("CANNOT CREATE USER");
    }
  }
  console.log(req.body);
};
const loginUser = async (req, res) => {
  const resData = await logUserIn(req.body);
  if (resData) {
    res.status(200).json(resData);
  } else {
    res.status(500).json("Invalid Credentials");
  }
};
const getUser = async (req, res) => {
  const userID = req.params.userID;
  const resData = await getUserByUserID(userID);
  if (resData.length === 1) {
    const db_user = resData[0];
    const user = {
      userid: db_user[0],
      username: db_user[1],
      name: db_user[2],
      profile_picture: db_user[3],
      bio: db_user[4],
      country_code: db_user[5],
      phone: db_user[6],
      email: db_user[7],
    };
    res.status(200).json(user);
  } else {
    res.status(500).json("USER NOT FOUND");
  }
};

const getProfile = async (req, res) => {
  const userID = req.params.userID;
  const resData = await getUserProfile(userID);
  res.status(200).json(resData);
};

module.exports = { createUser, loginUser, getUser, getProfile };
