const fs = require('fs')
const endTurn = require("../commands/endTurn.js")
const drawCard = require('../otherFunctions/drawCard.js')
const logAction=require('../otherFunctions/logAction.js')
module.exports = function (req, res, cardid) {
    fs.readFile('games.json', 'utf8', (err, data) => {
        const username = req.headers.username
        const game = req.headers.joincode
        var games = JSON.parse(data)
        if (!games[game]["card_played_this_turn"]) {
            games = drawCard(games, game, username, 5)
            const handIndex = games[game]['players'][username]['hand'].indexOf(parseInt(cardid))
            games[game]['players'][username]['hand'].splice(handIndex, 1)
            games[game]['card_played_this_turn'] = true
            fs.writeFile('games.json', JSON.stringify(games, null, "\t"), function (err) {
                if (err) console.log(err)
                logAction(`${username} has played lottery`, game)
                endTurn(req, res)
            })
        }
    })
}