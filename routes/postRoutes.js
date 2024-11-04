const express = require("express");
const router = express.Router();
const { createPost, likePost } = require("../controllers/postController");

router.post("/create", createPost);
router.post("/like", likePost);

module.exports = router
