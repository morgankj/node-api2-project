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

router.get('/:id', (req, res) => {
    Post.findById(req.params.id)
        .then(post => {
            if (post) {
                res.status(200).json(post);
            } else {
                res.status(404).json({ message: "The post with the specified ID does not exist" });
            }
        })
        .catch(err => {
            console.error(err);
            res.status(500).json({ message: "The post information could not be retrieved" });
        })
})

router.post('/', (req, res) => {
    const { title, contents } = req.body;
    if (!title || !contents) {
        res.status(400).json({ message: "Please provide title and contents for the post" });
    } else {
        Post.insert(req.body)
            .then(postID => {
                Post.findById(postID.id)
                    .then(post => {
                        res.status(201).json(post);
                    })
            })
            .catch(err => {
                console.error(err);
                res.status(500).json({ message: "There was an error while saving the post to the database" })
            })
    }
})

router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { title, contents } = req.body;
    if (!title || !contents) {
        res.status(400).json({ message: "Please provide title and contents for the post" });
    } else {
        const postSearch = await Post.findById(id);
        if (!postSearch) {
            res.status(404).json({ message: "The post with the specified ID does not exist" })
        } else {
            Post.update(id, { title, contents })
            .then(count => {
                if (count === 1) {
                    Post.findById(id)
                        .then(post => {
                            res.status(200).json(post);
                        })
                } else {
                    res.status(500).json({ message: "The post information could not be modified" });
                }
            })    
        }
    }
})

module.exports = router;