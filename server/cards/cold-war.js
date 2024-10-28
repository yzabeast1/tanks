const fs = require('fs')
const logAction = require('../otherFunctions/logAction.js')
module.exports = function (req, res, cardid) {
    var games = JSON.parse(fs.readFileSync("games.json", 'utf8'))
    var game = req.headers.joincode
    var username = req.headers.username
    var queuedCard = req.headers.queuedCard
    var cardIndex = -1
    for (var i = 0; i < games[game]['players'][username]['queued_cards'].length; i++)if (games[game]['players'][username]['queued_cards'][i]['cardid'] == queuedCard) cardIndex = i
    if (cardIndex != -1) {
        games[game]['players'][username]['queued_cards'][cardIndex]['countdown']--
        const handIndex = games[game]['players'][username]['hand'].indexOf(parseInt(cardid))
        games[game]['players'][username]['hand'].splice(handIndex, 1)
        logAction(`${username} played cold war on their ${games[game]['players'][username]['queued_cards'][cardIndex]['name']}`, game)
        games[game]["card_played_this_turn"] = true
        fs.writeFileSync('games.json', JSON.stringify(games, null, "\t"))
    }
}