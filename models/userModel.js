const { executeQuery } = require("../config/db");

const followUser = async (user) => {
  let query;
  const { userID, followerID, isActionFollow } = user;
  const params = [userID, followerID]
  isActionFollow ?
    query = 'INSERT INTO IG_FOLLOWERS (FOLLOWER_ID, FOLLOWING_ID) VALUES (:userID, :followerID)' :
    query = 'DELETE FROM IG_FOLLOWERS WHERE FOLLOWER_ID = :followerID AND FOLLOWING_ID = :userID';
  await executeQuery(query, params);
}

const updateUser = async (user) => {
  const { userID, profile_picture, bio } = user;
  const query = 'UPDATE IG_USERS SET PROFILE_PICTURE = :profile_picture, BIO = :bio WHERE USER_ID = :userID';
  const params = [profile_picture, bio, userID];
  await executeQuery(query, params);
}

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
    ${isUserCreatedWithEmail ? "EMAIL" : "PHONE"
    }) values (IG_USER_ID_SEQ.NEXTVAL, :username, :name, :password, :identifier)`;

  await executeQuery(query, [
    username,
    name,
    password,
    identifier,
  ]);

  const result = await executeQuery('SELECT JSON_OBJECT (USER_ID, USERNAME, NAME) FROM IG_USERS WHERE USERNAME = :username', [username]);
  return JSON.parse(result.rows);
};
const getUserByUserID = async (userID) => {
  const query =
    "SELECT USER_ID, USERNAME, NAME, PROFILE_PICTURE, BIO, COUNTRY_CODE, PHONE, EMAIL FROM IG_USERS WHERE USERNAME = :userID";
  const params = [userID];
  const result = await executeQuery(query, params);
  return result.rows;
};

const getUserProfile = async (username) => {

  const userQuery =
    "SELECT JSON_OBJECT (USER_ID, USERNAME, NAME, PROFILE_PICTURE, BIO, IS_PRIVATE) FROM IG_USERS WHERE USERNAME = :username";
  const userResult = await executeQuery(userQuery, [username]);
  const user = JSON.parse(userResult.rows[0]);
  const userID = user.USER_ID;
  const isPrivate = user.IS_PRIVATE;
  const params = [userID];

  const followingCountResult = await executeQuery("SELECT COUNT(*) FROM IG_FOLLOWERS WHERE FOLLOWER_ID = :userID", params);
  const followerCountResult = await executeQuery("SELECT COUNT(*) FROM IG_FOLLOWERS WHERE FOLLOWING_ID = :userID", params);
  const postCountResult = await executeQuery("SELECT COUNT(*) FROM IG_POSTS WHERE USER_ID = :userID", params);

  let postData = [];
  if (!isPrivate) {
    const postsQuery = "SELECT * FROM IG_POSTS WHERE USER_ID = :userID";
    const postsResult = await executeQuery(postsQuery, params);
    postData = postsResult.rows;
  }
  return {
    user: user,
    followers: followerCountResult.rows[0][0],
    following: followingCountResult.rows[0][0],
    postCount: postCountResult.rows[0][0],
    posts: postData,
  };
};

module.exports = { insertNewUser, getUserByUserID, getUserProfile, logUserIn, updateUser, followUser };
