const multer = require('multer');
const { GridFSBucket, MongoClient } = require('mongodb');
const { connection } = require('mongoose');

// Memory storage for temporary file handling
const storage = multer.memoryStorage();

// File filter
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Not an image! Please upload an image.'), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});

// Function to store file in GridFS
const storeFileInGridFS = async (file) => {
  const bucket = new GridFSBucket(connection.db, {
    bucketName: 'images'
  });

  const uploadStream = bucket.openUploadStream(file.originalname, {
    contentType: file.mimetype
  });

  return new Promise((resolve, reject) => {
    // Create a buffer from the file data
    const buffer = Buffer.from(file.buffer);

    // Write the buffer to GridFS
    uploadStream.write(buffer);
    uploadStream.end();

    uploadStream.on('finish', function() {
      resolve(uploadStream.id);
    });

    uploadStream.on('error', reject);
  });
};

module.exports = { upload, storeFileInGridFS };