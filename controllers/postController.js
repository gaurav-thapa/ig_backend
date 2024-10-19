const { addPost } = require("../models/postModel")

const createPost =async (req, res) => {

    console.log('req body - ',req.body);
    const result = await addPost(req.body);
    if(result){
        res.status(200).json('upload success');
    }
    else{
        res.status(500).json('upload failed')
    }
}

module.exports = {createPost}