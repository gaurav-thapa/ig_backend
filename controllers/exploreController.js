const { getPeopleSuggestion, getPostsData } = require("../models/exploreModel");

const getPeople = async (req, res) => {
    const userID = req.headers['userid'];
    // console.log(req.headers);
    try {

        const result = await getPeopleSuggestion(userID);
        res.status(200).json(result);
    }
    catch (error) {
        console.error(error);
        res.status(500).json('Error fetching users');
    }
}
const getPosts = async (req, res) => {
    const userID = req.headers['userid'];
    try{
        const result = await getPostsData(userID);
        res.status(200).json(result);
    }
    catch(error){
        console.error(error);
        res.status(500).json('could not fetch posts');
    }
}

module.exports = { getPeople, getPosts };