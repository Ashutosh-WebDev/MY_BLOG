const mongoose = require('mongoose');
const { GridFSBucket } = require('mongodb');
const Post = require('../models/post.model');
const { storeFileInGridFS } = require('../middleware/upload.middleware');

let bucket;
mongoose.connection.once('open', () => {
  bucket = new GridFSBucket(mongoose.connection.db, {
    bucketName: 'images'
  });
});

// Get all posts
const getPosts = async (req, res) => {
  try {
    const posts = await Post.find().populate('author', 'email');
    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get featured posts
const getFeaturedPosts = async (req, res) => {
  try {
    const posts = await Post.find({ featured: true }).populate('author', 'email');
    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get single post by ID
const getPostById = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id).populate('author', 'email');
    if (post) {
      res.json(post);
    } else {
      res.status(404).json({ message: 'Post not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create a new post
const createPost = async (req, res) => {
  try {
    const { title, content, excerpt, featured } = req.body;
    
    if (!title || !content || !excerpt) {
      return res.status(400).json({ message: 'Title, content, and excerpt are required' });
    }

    let imageId;
    if (req.file) {
      // Store file in GridFS
      imageId = await storeFileInGridFS(req.file);
    }

    const post = await Post.create({
      title,
      content,
      excerpt,
      image: imageId,
      featured: featured === 'true',
      author: req.user._id
    });

    res.status(201).json(post);
  } catch (error) {
    console.error('Error creating post:', error);
    res.status(400).json({ message: error.message });
  }
};

// Get image
const getImage = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(404).json({ message: 'Invalid image ID' });
    }

    const _id = new mongoose.Types.ObjectId(req.params.id);
    const files = await bucket.find({ _id }).toArray();
    
    if (!files || files.length === 0) {
      return res.status(404).json({ message: 'Image not found' });
    }

    res.set('Content-Type', files[0].contentType);
    const downloadStream = bucket.openDownloadStream(_id);
    downloadStream.pipe(res);
  } catch (error) {
    console.error('Error getting image:', error);
    res.status(500).json({ message: 'Error retrieving image' });
  }
};

// Delete image
const deleteImage = async (imageId) => {
  try {
    if (imageId && mongoose.Types.ObjectId.isValid(imageId)) {
      await bucket.delete(new mongoose.Types.ObjectId(imageId));
    }
  } catch (error) {
    console.error('Error deleting image:', error);
  }
};

// Update post
const updatePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    const { title, content, excerpt, featured } = req.body;

    if (!title || !content || !excerpt) {
      return res.status(400).json({ message: 'Title, content, and excerpt are required' });
    }

    // Handle image update
    let imageId = post.image;
    if (req.file) {
      // Delete old image if it exists
      if (post.image) {
        await deleteImage(post.image);
      }
      // Store new image
      imageId = await storeFileInGridFS(req.file);
    }

    post.title = title;
    post.content = content;
    post.excerpt = excerpt;
    post.image = imageId;
    post.featured = featured === 'true';

    const updatedPost = await post.save();
    res.json(updatedPost);
  } catch (error) {
    console.error('Error updating post:', error);
    res.status(400).json({ message: error.message });
  }
};

// Delete post
const deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    // Delete associated image first
    await deleteImage(post.image);
    
    // Then delete the post
    await post.deleteOne();
    res.json({ message: 'Post deleted successfully' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  getPosts,
  getFeaturedPosts,
  getPostById,
  createPost,
  updatePost,
  deletePost,
  getImage
};