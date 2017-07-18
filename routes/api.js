var express = require('express');
var router = express.Router();
var multer = require('multer');
var fs = require('fs');
var Post = require('../models/Post');

var storage = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, 'public/uploads/');
    },
    filename: function(req, file, cb){
        cb(null, file.originalname);
    }
});

var upload = multer({storage: storage});


/* GET home page. Listing posts */
router.get('/', function(req, res) {
  Post.find({}, function (err, posts) {
    res.json({ posts: posts });
  });
});

/* View a single post */
router.get('/posts/:id', function(req, res) {
    Post.findById(req.params.id, function (err, post) {
        if(err){
            res.json({message: 'Post was not found', error: err});
        } else {
            res.json({post: post});
        }
    });
});

/* Create new blog */
router.post('/new', upload.single('feature'), function(req, res){
  Post.create({
      title: req.body.title,
      content: req.body.content,
      feature:  req.file.originalname,
      created_at: Date.now(),
      updated_at: Date.now()
  }, function(err){
    if(!err){
      res.json({message: 'Blog created successfully'});
    } else {
        res.json({message: 'Error creating blog'});
    }
  });
});

/* Deleting a post*/
router.delete("/delete/:id", function(req, res){
  Post.findById(req.params.id, function(err, post){
    if(err){
      res.json({message: "Post was not found", error: error});
    } else {
        fs.unlink('public/uploads/' +post.feature, function(err3){
        });
        post.remove(function(err2){
          if(err2){
              res.json({message: "Error deleting post", error: error});
          }else {
              res.json({message: 'Success'});
          }
        });
    }
  });
});

/* Update a post */
router.put("/edit/:id", upload.single('feature'), function(req, res){
    Post.findById(req.params.id, function(err, post){
        post.title = req.body.title;
        post.content = req.body.content;
        post.updated_at = Date.now();
        if(req.file){
            post.feature = req.file.originalname;
        }

        post.save(function(err){
            res.json({post: post});
        });
    });
});

module.exports = router;
