const fs = require('fs')
module.exports = function (req, res) {
    const cardID = req.headers.cardid
    const username = req.headers.username
    const joincode=req.headers.joincode
    fs.readFile('deck.json', 'utf8', (err, data) => {
        fs.readFile('games.json', 'utf8', (err1, data1) => {
            const game=JSON.parse(data1)[joincode]
            if (username==game['order'][game['turn']]) {
                const deck = JSON.parse(data)
                const card = deck[cardID]
                const cardFunction = require("../" + card['code-location'])
                cardFunction(req, res, cardID)
            }
            res.end()
        })
    })
}