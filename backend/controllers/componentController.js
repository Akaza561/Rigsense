const Component = require('../models/Component');

// @desc    Get all components grouped by type
// @route   GET /api/components
// @access  Public
const getAllComponents = async (req, res) => {
    try {
        const components = await Component.find({});

        // Group by part type
        const grouped = components.reduce((acc, item) => {
            const type = item.part.toLowerCase();
            if (!acc[type]) {
                acc[type] = [];
            }
            acc[type].push(item);
            return acc;
        }, {});

        res.json(grouped);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

module.exports = { getAllComponents };
