const fs = require('fs')
const drawCard = require('../otherFunctions/drawCard.js')
const logAction=require('../otherFunctions/logAction.js')
module.exports = function (req, res, cardid) {
    fs.readFile('games.json', 'utf8', (err, data) => {
        const username = req.headers.username
        const game = req.headers.joincode
        const discardCard = req.headers.discardcard
        var games = JSON.parse(data)
        games = drawCard(games, game, username, 3)
        const discardIndex = games[game]['players'][username]['hand'].indexOf(parseInt(discardCard))
        games[game]['players'][username]['hand'].splice(discardIndex, 1)
        const handIndex = games[game]['players'][username]['hand'].indexOf(parseInt(cardid))
        games[game]['players'][username]['hand'].splice(handIndex, 1)
        games[game]["card_played_this_turn"] = true
        fs.writeFile('games.json', JSON.stringify(games, null, "\t"), function (err) { if (err) console.log(err) })
        const deck = JSON.parse(fs.readFileSync('deck.json', 'utf8'))
        logAction(`${username} has played helpful hand and discarded ${deck[discardCard]['name']}`, game)
    })
}