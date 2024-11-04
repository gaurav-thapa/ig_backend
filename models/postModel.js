const { executeQuery } = require("../config/db");

const addPost = async (post) => {
    console.log(post);
    const { userID, mediaURL, caption } = post;
    const query = `INSERT INTO IG_POSTS (POST_ID, USER_ID, MEDIA_URL, CAPTION, IS_EDITED) VALUES 
    (INSTA_POST_ID_SEQ.NEXTVAL, :userID, :mediaURL, :caption, 0)`;
    const params = [userID, mediaURL, caption];
    const result = await executeQuery(query, params);
    return result;
}

const toggleLike = async (data) => {
    const { userID, postID, isLiked } = data;
    let query;
    if (isLiked) {
        query = 'INSERT INTO IG_LIKES VALUES (:postID, :userID)';
    }
    else {
        query = 'DELETE FROM IG_LIKES WHERE POST_ID = :postID and USER_ID = :userID';
    }
    const params = [postID, userID];
    await executeQuery(query, params);
}
module.exports = { addPost, toggleLike }