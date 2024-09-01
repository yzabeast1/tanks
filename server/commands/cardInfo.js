const fs = require('fs')
module.exports = function (req, res) {
    fs.readFile('deck.json', 'utf8', (err, data) => {
        const cardID=req.headers.cardid
        res.end(JSON.stringify(JSON.parse(data)[cardID]))
    })
}