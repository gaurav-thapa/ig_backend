const { getPeople, getPosts } = require("../controllers/exploreController");

const express = require('express');
const router = express.Router();

router.get('/people', getPeople);
router.get('/posts', getPosts);

module.exports = router;