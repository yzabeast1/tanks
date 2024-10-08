const fs = require('fs')
const removeIfDead = require("../otherFunctions/removeIfDead.js")
const logAction=require('../otherFunctions/logAction.js')
module.exports = function (req, res, cardid) {
    fs.readFile('games.json', 'utf8', (err, data) => {
        const username = req.headers.username
        const game = req.headers.joincode
        const target = req.headers.target
        var games = JSON.parse(data)
        if (games[game]['event_count'] > 0) {
            logAction(`${username} has played airstrike against ${target}`,game)
            games[game]['event_count']--
            games[game]['players'][target]['hand'] = []
            games[game]['players'][username]['health'] -= 3
            const handIndex = games[game]['players'][username]['hand'].indexOf(parseInt(cardid))
            games[game]['players'][username]['hand'].splice(handIndex, 1)
            games = removeIfDead(games, game, username)
            games[game]["card_played_this_turn"] = true
            fs.writeFileSync('games.json', JSON.stringify(games, null, "\t"))
        }
    })
}