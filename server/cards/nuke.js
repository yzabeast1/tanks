const fs = require('fs')
const endTurn = require("../commands/endTurn.js")
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
                fs.writeFile('games.json', JSON.stringify(games, null, "\t"), function (err) { if (err) console.log(err) })
                endTurn(req, res)
            }
        }
    })
}
