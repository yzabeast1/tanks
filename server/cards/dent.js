const fs = require('fs')
const removeIfDead = require("../otherFunctions/removeIfDead.js")
module.exports = function (req, res, cardid) {
    fs.readFile('games.json', 'utf8', (err, data) => {
        var games = JSON.parse(data)
        var game = req.headers.joincode
        var target = req.headers.target
        const username = req.headers.username
        if (games[game]['shooting_allowed'] || games[game]['no_shooting_player'] == username) {
            if (games[game]['shooting_count'] > 0) {
                games[game]['shooting_count']--
                games[game]['players'][target]['health']--
                const handIndex = games[game]['players'][username]['hand'].indexOf(parseInt(cardid))
                games[game]['players'][username]['hand'].splice(handIndex, 1)
                games = removeIfDead(games, game, target)
                games[game]["card_played_this_turn"] = true
                fs.writeFile('games.json', JSON.stringify(games, null, "\t"), function (err) { if (err) console.log(err) })
            }
        }
    })
}