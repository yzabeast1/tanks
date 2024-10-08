const fs = require('fs')
const endTurn = require("../commands/endTurn.js")
const logAction = require('../otherFunctions/logAction.js')
module.exports = function (req, res, cardid) {
    fs.readFile('games.json', 'utf8', (err, data) => {
        const username = req.headers.username
        const game = req.headers.joincode
        var target = req.headers.target
        var games = JSON.parse(data)
        if (games[game]['shooting_allowed'] || games[game]['no_shooting_player'] == username) {
            if (!games[game]["card_played_this_turn"]) {
                games[game]['players'][target]['health'] = 2
                const handIndex = games[game]['players'][username]['hand'].indexOf(parseInt(cardid))
                games[game]['players'][username]['hand'].splice(handIndex, 1)
                games[game]['card_played_this_turn'] = true
                fs.writeFileSync('games.json', JSON.stringify(games, null, "\t"))
                endTurn(req, res)
                logAction(`${username} has played nuke against ${target}`, game)
            }
        }
    })
}
