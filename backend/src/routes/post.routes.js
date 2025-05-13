const express = require('express');
const router = express.Router();
const { upload } = require('../middleware/upload.middleware');
const { protect, admin } = require('../middleware/auth.middleware');
const { 
  getPosts, 
  getFeaturedPosts, 
  getPostById, 
  createPost, 
  updatePost, 
  deletePost,
  getImage
} = require('../controllers/post.controller');

// Image routes
router.get('/image/:id', getImage);

// Post routes
router.post('/', protect, admin, upload.single('image'), createPost);
router.get('/', getPosts);
router.get('/featured', getFeaturedPosts);
router.get('/:id', getPostById);
router.put('/:id', protect, admin, upload.single('image'), updatePost);
router.delete('/:id', protect, admin, deletePost);

module.exports = router;