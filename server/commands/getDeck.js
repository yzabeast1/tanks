const fs = require('fs')
module.exports = function (req, res) {
    fs.readFile('deck.json', 'utf8', (err, data) => {
        res.end(data)
    })
}