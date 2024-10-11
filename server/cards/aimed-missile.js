const fs = require('fs')
const logAction = require('../otherFunctions/logAction.js')
module.exports = function (req, res, cardid) {
    var games = JSON.parse(fs.readFileSync('games.json', 'utf8'))
    var game = req.headers.joincode
    var username = req.headers.username
    if (games[game]['shooting_allowed'] || games[game]['no_shooting_player'] == username) {
        if (games[game]['shooting_count'] > 0) {
            logAction(`${username} has played aimed missile`, game)
            var queuedCard = JSON.parse(`{
                    "name":"aimed missile",
                    "cardid":${cardid},
                    "damage":3,
                    "countdown":2
                }`)
            games[game]['players'][username]['queued_cards'].push(queuedCard)
            const handIndex = games[game]['players'][username]['hand'].indexOf(parseInt(cardid))
            games[game]['players'][username]['hand'].splice(handIndex, 1)
            games[game]["card_played_this_turn"] = true
            fs.writeFileSync('games.json', JSON.stringify(games, null, "\t"))
        }
    }
}