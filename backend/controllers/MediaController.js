const WebsiteMedia = require('../models/WebsiteMediaModel'); // Path to the WebsiteMedia model
const cloudinary = require('cloudinary').v2;

// Cloudinary Configuration
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});



// Get media by type
exports.getMediaByType = async (req, res) => {
  try {
    const { media_type } = req.params;

    const media = await WebsiteMedia.findAll({
      where: { media_type },
    });

    if (!media.length) {
      return res.status(404).json({ message: 'No media found for this type.' });
    }

    res.status(200).json({
      message: 'Media retrieved successfully',
      data: media,
    });
  } catch (error) {
    console.error('Error retrieving media:', error);
    res.status(500).json({
      message: 'Error retrieving media',
      error: error.message,
    });
  }
};



// Get media by type
exports.getAllMediaType = async (req, res) => {
  try {
    

    const media = await WebsiteMedia.findAll();

    if (!media.length) {
      return res.status(404).json({ message: 'No media found.' });
    }

    res.status(200).json({
      message: 'Media retrieved successfully',
      data: media,
    });
  } catch (error) {
    console.error('Error retrieving media:', error);
    res.status(500).json({
      message: 'Error retrieving media',
      error: error.message,
    });
  }
};

// Update media by ID
exports.updateMedia = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, created_by, media_type } = req.body;

    const media = await WebsiteMedia.findByPk(id);
    if (!media) {
      return res.status(404).json({ message: 'Media not found' });
    }

    // Update fields
    media.status = status || media.status;
    media.created_by = created_by || media.created_by;
    media.media_type = media_type || media.media_type;

    await media.save();

    res.status(200).json({
      message: 'Media updated successfully',
      data: media,
    });
  } catch (error) {
    console.error('Error updating media:', error);
    res.status(500).json({
      message: 'Error updating media',
      error: error.message,
    });
  }
};

// Delete media by ID
exports.deleteMedia = async (req, res) => {
  try {
    const { id } = req.params;

    const media = await WebsiteMedia.findByPk(id);
    if (!media) {
      return res.status(404).json({ message: 'Media not found' });
    }



    await media.destroy();

    res.status(200).json({ message: 'Media deleted successfully' });
  } catch (error) {
    console.error('Error deleting media:', error);
    res.status(500).json({
      message: 'Error deleting media',
      error: error.message,
    });
  }
};
