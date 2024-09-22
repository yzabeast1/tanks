const path = require('path');
const fs = require('fs');
module.exports = function (req, res) {
    if (!cardName) {
        return res.status(400).send('Card name header is missing');
    }

    // Find the card in the deck
    const card = deck.find(c => c.name.toLowerCase() === cardName.toLowerCase());

    if (!card) {
        return res.status(404).send('Card not found');
    }

    // Path to the image file from deck.json
    const imagePath = path.join(__dirname, card['image-location']);

    // Check if the image exists
    fs.access(imagePath, fs.constants.F_OK, (err) => {
        if (err) {
            return res.status(404).send('Image not found');
        }

        // Stream the image as a response
        res.sendFile(imagePath);
    });
}