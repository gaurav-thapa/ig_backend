const { executeQuery } = require("../config/db");

const getPeopleSuggestion = async (userID) => {
    // console.log('userID - ',userID);
    const query = `SELECT JSON_OBJECT (USER_ID, USERNAME, NAME, PROFILE_PICTURE) FROM IG_USERS
     WHERE IG_USERS.USER_ID <> :userID 
     AND IG_USERS.USER_ID NOT IN (SELECT F.FOLLOWING_ID FROM IG_FOLLOWERS F WHERE F.FOLLOWER_ID = :userID)`;
    const params = [userID];
    const result = await executeQuery(query, params);
    const parsedRows = result.rows.map((row) => JSON.parse(row[0]));
    return parsedRows;
}

const getPostsData = async (userID) => {
    const query = `
    select 
    json_object (
       'post_id' VALUE p.post_id,
       'user_id' VALUE p.user_id,
       'media_url' VALUE p.media_url,
       'caption' VALUE p.caption,
       'is_edited' VALUE p.is_edited,
       'created_date' VALUE p.created_date,
       'username' VALUE u.username,
       'name' VALUE u.name,
       'profile_picture' VALUE u.profile_picture,
       'total_like_count' VALUE count(tl.post_id),
       'is_liked_by_user' VALUE case when l.user_id is not null then 1 else 0 end
    ) as post_data
  from ig_posts p
  join ig_users u
      on p.user_id = u.user_id
  left join ig_likes tl
      on tl.post_id = p.post_id
  left join ig_likes l
      on l.post_id = p.post_id
      and l.user_id = :userID
 where u.is_private = 0
   and u.user_id <> :userID
 group by p.post_id,
          p.user_id,
          p.media_url,
          p.caption,
          p.is_edited,
          p.created_date,
          u.username,
          u.name,
          u.profile_picture,
          l.user_id
 order by p.created_date desc
`;
    const params = [userID];
    const result = await executeQuery(query, params);

    const parsedRows = result.rows.map((row) => JSON.parse(row[0]));
    return parsedRows;
}

module.exports = { getPeopleSuggestion, getPostsData }