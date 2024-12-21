const { Sequelize } = require('sequelize');
const sequelize = new Sequelize('my_database', 'root', 'Oracle@12345', {
    host: 'localhost',
    dialect: 'mysql',
});

// Function to get content by section ID
exports.getContentBySectionId = async (req, res) => {
    const { sec_id } = req.params;

    try {
        // Use a raw SQL query to fetch content by sec_id
        const contentList = await sequelize.query(
            'SELECT * FROM page_content WHERE sec_id = :sec_id',
            {
                replacements: { sec_id }, // Safeguards against SQL injection
                type: Sequelize.QueryTypes.SELECT, // Ensures SELECT query
            }
        );

        if (contentList.length === 0) {
            return res.status(404).json({ message: 'No content found for this section.' });
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

// Function to update content based on short_name
exports.updateContentByShortName = async (req, res) => {
    const { short_name, content } = req.body; // Extract short_name and content from request body

    if (!short_name ) {
        return res.status(400).json({ message: 'short_name and content are required.' });
    }

    try {
        // Update the content where short_name matches
        const [updatedRows] = await sequelize.query(
            'UPDATE page_content SET content = :content WHERE short_name = :short_name',
            {
                replacements: { short_name, content },
                type: Sequelize.QueryTypes.UPDATE, // Ensures UPDATE query
            }
        );

        if (updatedRows === 0) {
            return res.status(404).json({ message: 'Content with this short_name not found.' });
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



// Function to get content by short_name(s)
exports.getContentByShortName = async (req, res) => {
    const { short_name } = req.params;

    try {
        // Split short_name by comma to handle multiple short names
        const shortNames = short_name.split(',');

        // Use a raw SQL query with IN clause to fetch content for multiple short names
        const content = await sequelize.query(
            'SELECT * FROM page_content WHERE short_name IN (:shortNames)',
            {
                replacements: { shortNames }, // Safeguards against SQL injection
                type: Sequelize.QueryTypes.SELECT, // Ensures SELECT query
            }
        );

        if (content.length === 0) {
            return res.status(404).json({ message: 'No content found for the provided short names.' });
        }

        res.status(200).json({
            message: 'Content retrieved successfully.',
            data: content,
        });
    } catch (error) {
        console.error('Error retrieving content:', error);
        res.status(500).json({
            message: 'Failed to retrieve content.',
            error,
        });
    }
};

