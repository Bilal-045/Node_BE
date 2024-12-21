// upload.js
const express = require('express');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

const router = express.Router();

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET,
});

// Configure Multer to use Cloudinary storage
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'uploads', // Optional: folder name in Cloudinary
        allowedFormats: ['jpeg', 'png', 'jpg'], // Allowed formats
        transformation: [{ width: 500, height: 500, crop: 'limit' }], // Optional: image transformation
    },
});

const upload = multer({ storage: storage });

// API Route for uploading images
router.post('/upload', upload.single('image'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
    }

    // Respond with the URL of the uploaded image
    res.json({
        message: 'Image uploaded successfully',
        url: req.file.path, // Cloudinary URL for the uploaded image
    });
});

module.exports = router;

