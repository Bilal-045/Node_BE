const { Sequelize } = require('sequelize');
const sequelize = new Sequelize('my_database', 'root', 'Oracle@12345', {
    host: 'localhost',
    dialect: 'mysql',
});

// Function to get content by page ID
exports.getSeoByPageId = async (req, res) => {
    const { page_id } = req.params;
console.log("page id "+page_id)
    try {
        // Use a raw SQL query to fetch content by page_id
        const contentList = await sequelize.query(
            'SELECT * FROM page_seo WHERE page_id = :page_id',
            {
                replacements: { page_id }, // Safeguards against SQL injection
                type: Sequelize.QueryTypes.SELECT, // Ensures SELECT query
            }
        );

        if (contentList.length === 0) {
            return res.status(404).json({ message: 'No content found for this page.' });
        }

        res.status(200).json({
            message: 'Content retrieved successfully.',
            data: contentList,
        });
    } catch (error) {
        console.error('Error retrieving content:', error);
        res.status(500).json({
            message: 'Failed to retrieve content.',
            error,
        });
    }
};

// Function to update content based on page ID
exports.updateSeoByPageId = async (req, res) => {
    const { page_id,meta_title,meta_description,meta_keywords,og_title,
        og_description,og_url,viewport_meta
     } = req.body; // Extract page_id and content from request body

    if (!page_id) {
        return res.status(400).json({ message: 'page_id and content are required.' });
    }

    try {
        // Update the content where page_id matches
        const [updatedRows] = await sequelize.query(
            'UPDATE page_seo SET meta_title = :meta_title,meta_description= :meta_description,meta_keywords= :meta_keywords ,og_title=:og_title,og_description=:og_description ,og_url= :og_url ,viewport_meta=:viewport_meta  WHERE page_id = :page_id',
            {
                replacements: { page_id, meta_title,meta_description,
                    meta_keywords,og_title,og_description,og_url,viewport_meta
                 },
                type: Sequelize.QueryTypes.UPDATE, // Ensures UPDATE query
            }
        );

        if (updatedRows === 0) {
            return res.status(404).json({ message: 'Content for this page_id not found.' });
        }

        res.status(200).json({
            message: 'Content updated successfully.',
        });
    } catch (error) {
        console.error('Error updating content:', error);
        res.status(500).json({
            message: 'Failed to update content.',
            error,
        });
    }
};
