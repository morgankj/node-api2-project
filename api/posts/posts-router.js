// implement your posts router here
const Post = require('./posts-model');
const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    Post.find(req.query)
        .then(posts => {
            res.status(200).json(posts);
        })
        .catch(err => {
            console.error(err);
            res.status(500).json({ message: "The posts information could not be retrieved" });
        })
})

module.exports = router;