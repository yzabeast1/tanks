const path = require('path');
module.exports = function (req, res) {
    const deckPath = path.join(__dirname, '../deck.json');
    res.sendFile(deckPath);
}