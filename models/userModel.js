const { executeQuery } = require("../config/db");

const logUserIn = async (user) => {
  const { identifier, password } = user;
  const identifierType = identifier.includes("@")
    ? "EMAIL"
    : /^\d+$/.test(identifier)
    ? "PHONE"
    : "USERNAME";
  const query = `SELECT JSON_OBJECT (USER_ID, USERNAME, NAME, PROFILE_PICTURE) FROM IG_USERS WHERE ${identifierType} = :identifier and HASHED_PASSWORD = :password`;
  const params = [identifier, password];
  const result = await executeQuery(query, params);
  if (result.rows.length === 1) {
    return JSON.parse(result.rows[0]);
  } else {
    return null;
  }
};

const insertNewUser = async (user) => {
  const { identifier, username, name, password } = user;
  const isUserCreatedWithEmail = identifier.includes("@");
  const query = `INSERT INTO IG_USERS (USER_ID, USERNAME, NAME, HASHED_PASSWORD, 
    ${
      isUserCreatedWithEmail ? "EMAIL" : "PHONE"
    }) values (IG_USER_ID_SEQ.NEXTVAL, :username, :name, :password, :identifier)`;

  const result = await executeQuery(query, [
    username,
    name,
    password,
    identifier,
  ]);
};
const getUserByUserID = async (userID) => {
  const query =
    "SELECT USER_ID, USERNAME, NAME, PROFILE_PICTURE, BIO, COUNTRY_CODE, PHONE, EMAIL FROM IG_USERS WHERE USERNAME = :userID";
  const params = [userID];
  const result = await executeQuery(query, params);
  return result.rows;
};

const getUserProfile = async (userID) => {
  const userQuery =
    "SELECT JSON_OBJECT (USERNAME, NAME, PROFILE_PICTURE, BIO) FROM IG_USERS WHERE USER_ID = :userID";
  const params = [userID];
  const userResult = await executeQuery(userQuery, params);
  const postsQuery = "SELECT * FROM IG_POSTS WHERE USER_ID = :userID";
  const postsResult = await executeQuery(postsQuery, params);
  const followerCountQuery =
    "SELECT COUNT(*) FROM IG_FOLLOWERS WHERE FOLLOWER_ID = :userID";
  const followerCountResult = await executeQuery(followerCountQuery, params);
  const followingCountQuery =
    "SELECT COUNT(*) FROM IG_FOLLOWERS WHERE FOLLOWING_ID = :userID";
  const followingCountResult = await executeQuery(followingCountQuery, params);
  return {
    user: JSON.parse(userResult.rows[0]),
    posts: postsResult.rows,
    followers: followerCountResult.rows[0][0],
    following: followingCountResult.rows[0][0],
  };
};

module.exports = { insertNewUser, getUserByUserID, getUserProfile, logUserIn };
