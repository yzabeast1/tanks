const fs = require('fs')
module.exports = function (req, res) {
    const cardID = req.headers.cardid
    fs.readFile('deck.json', 'utf8', (err, data) => {
        const deck = JSON.parse(data)
        const card = deck[cardID]
        const cardFunction = require(card['code-location'])
        cardFunction(req, res, cardID)
    })
}