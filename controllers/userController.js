const {
  getUserByUserID,
  insertNewUser,
  getUserProfile,
  logUserIn,
  updateUser,
  followUser,
} = require("../models/userModel");

const toggleFollowUser = async (req, res)=>{
  const {isActionFollow} = req.body;
  try{
    await followUser(req.body);
    res.status(200).json(`${isActionFollow?'follow':'Unfollow'} success`);
  }
  catch(error){
    console.error(error);
    res.status(400).json(`failed to ${isActionFollow?'Follow':'Unfollow'} `);
  }
}

const saveProfile = async (req, res) => {
  try {
    await updateUser(req.body);
    res.status(200).json('user updated');
  }
  catch (error) {
    console.error(error);
    res.status(500).json('user not updated');
  }
}

const createUser = async (req, res) => {
  const { identifier, username, name, password } = req.body;
  if (
    identifier.trim() !== "" &&
    username.trim() !== "" &&
    name.trim() !== "" &&
    password.trim() !== ""
  ) {
    try {
      const newUser = await insertNewUser(req.body);
      res.status(200).json(newUser);
    } catch (error) {
      res.status(500).json("CANNOT CREATE USER");
    }
  }
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
  const username = req.params.username;
  const resData = await getUserProfile(username);
  res.status(200).json(resData);
};

module.exports = { createUser, loginUser, getUser, getProfile, saveProfile, toggleFollowUser };
