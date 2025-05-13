const mongoose = require('mongoose');

const postSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    excerpt: {
      type: String,
      required: true,
    },
    image: {
      type: mongoose.Schema.Types.ObjectId, // Store GridFS file ID
      required: false,
    },
    featured: {
      type: Boolean,
      default: false,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
  },
  {
    timestamps: true,
  }
);

// Delete associated image when post is deleted
postSchema.pre('remove', async function(next) {
  try {
    if (this.image) {
      await deleteImage(this.image);
    }
    next();
  } catch (error) {
    next(error);
  }
});

const Post = mongoose.model('Post', postSchema);

module.exports = Post;