const Section = require('../models/pageSectionModel'); // Path to the Section model


// Controller to retrieve sections by page ID
exports.getSectionsByPage = async (req, res) => {
    const { pageid } = req.params;

    if (!pageid) {
        return res.status(400).json({ message: "Page ID is required" });
    }

    try {
        const sections = await Section.findAll({
            where: {
                pageid,
            },
        });

        if (!sections.length) {
            return res.status(404).json({ message: "No sections found for this page." });
        }

        res.status(200).json({
            message: "Sections retrieved successfully",
            data: sections,
        });
    } catch (error) {
        console.error("Error fetching sections:", error);
        res.status(500).json({
            message: "Error retrieving sections",
            error: error.message,
        });
    }
};
