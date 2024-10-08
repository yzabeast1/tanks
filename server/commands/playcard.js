const fs = require('fs')
module.exports = function (req, res) {
    const cardID = req.headers.cardid
    const username = req.headers.username
    const game = req.headers.joincode
    const deck = JSON.parse(fs.readFileSync('deck.json', 'utf8'))
    var games = JSON.parse(fs.readFileSync('games.json', 'utf8'))
    if (username == games[game]['order'][games[game]['turn']]) {
        const card = deck[cardID]
        const cardFunction = require("../" + card['code-location'])
        cardFunction(req, res, cardID)
    }
    res.end()
}