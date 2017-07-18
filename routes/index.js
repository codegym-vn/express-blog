var express = require('express');
var router = express.Router();
var multer = require('multer');
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
    res.render('index', { posts: posts });
  });
});

/* View a single post */
router.get('/posts/:id', function(req, res) {
    Post.findById(req.params.id, function (err, post) {
        if(err){
            res.render('error', {message: 'Post was not found', error: err});
        } else {
            res.render('single', {post: post});
        }
    });
});

/* Show creating new blog form */
router.get('/new', function(req, res){
  res.render('new');
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
      res.render('new', {message: 'Blog created successfully'});
    } else {
        res.render('new', {message: 'Error creating blog'});
    }
  });
});

/* Show deleting blog form */
router.get('/delete/:id', function(req, res){
    Post.findById(req.params.id, function(err, post){
      if(err){
          res.render('error', {message: "Post was not found", error:{status: 404}});
      } else {
          res.render('delete', {post: post});
      }
    });
});

/* Deleting a post*/
router.post("/delete/:id", function(req, res){
  Post.findById(req.params.id, function(err, post){
    if(err){
      res.render('error', {message: "Post was not found", error: error});
    } else {
        post.remove(function(err2){
          if(err2){
              res.render('error', {message: "Error deleting post", error: error});
          }else {
              res.redirect('/');
          }
        });
    }
  });
});


/* Show edit blog form */
router.get('/edit/:id', function(req, res){
    Post.findById(req.params.id, function(err, post){
        if(err){
            res.render('error', {message: "Post was not found", error:{status: 404}});
        } else {
            res.render('edit', {post: post});
        }
    });
});

/* Update a post */
router.post("/edit/:id", upload.single('feature'), function(req, res){
    Post.findById(req.params.id, function(err, post){
        post.title = req.body.title;
        post.content = req.body.content;
        post.updated_at = Date.now();
        if(req.file){
            post.feature = req.file.originalname;
        }

        post.save(function(err){
            res.render('single', {post: post});
        });
    });
});

module.exports = router;
