const { addPost, toggleLike } = require("../models/postModel")

const createPost = async (req, res) => {
    // console.log('req body - ', req.body);
    const result = await addPost(req.body);
    if (result) {
        res.status(200).json('upload success');
    }
    else {
        res.status(500).json('upload failed')
    }
}

const likePost = async (req, res) => {
    const {isLiked} = req.body;
    try {
        const result = await toggleLike(req.body)
        res.status(200).json(`${isLiked?'like':'unlike'} successful`);
    }
    catch (error) {
        console.error(error);
        res.status(500).json('cannot like/unlike the post');
    }
}

module.exports = { createPost, likePost }