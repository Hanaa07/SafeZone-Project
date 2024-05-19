const Coordinates = require('../models/Coordinates');

// Controller for creating a new coordinate
exports.createCoordinate = async (req, res) => {
    try {
        const markerData = req.body;
        const coordinates = [];

        // Iterate over marker data and create coordinates
        for (const marker of markerData) {
            const { longitude, latitude, order } = marker;
            const coordinate = new Coordinates({ longitude, latitude, order });
            await coordinate.save();
            coordinates.push(coordinate);
        }

        res.status(201).json({ message: 'Coordinates created successfully', coordinates });
    } catch (error) {
        console.error('Error creating coordinates from markers:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Controller for getting all coordinates
exports.getAllCoordinates = async (req, res) => {
    try {
        const coordinates = await Coordinates.find();
        res.status(200).json(coordinates);
    } catch (error) {
        console.error('Error getting coordinates:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
