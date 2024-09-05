const fs = require('fs')
const removeAllIfDead = require("./otherFunctions/removeAllIfDead.js")
module.exports = function (req, res, cardid) {
    fs.readFile('games.json', 'utf8', (err, data) => {
        const username = req.headers.username
        const game = req.headers.joincode
        var games = JSON.parse(data)
        if (games[game]['event_count'] > 0) {
            games[game]['event_count']--
            games[game]['players'][username]['health']++
            for (var player in games[game]['players']) {
                player['health'] -= 3
                removeAllIfDead(games, game)
            }
            const handIndex = games[game]['players'][username]['hand'].indexOf(cardid)
            games[game]['players'][username]['hand'].splice(handIndex, 1)
            games[game]["card_played_this_turn"] = true
            fs.writeFile('games.json', JSON.stringify(games, null, "\t"), function (err) { if (err) console.log(err) })
        }
    })
}