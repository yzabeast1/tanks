const fs = require('fs')
const removeAllIfDead = require("../otherFunctions/removeAllIfDead.js")
const logAction = require('../otherFunctions/logAction.js')
module.exports = function (req, res, cardid) {
    fs.readFile('games.json', 'utf8', (err, data) => {
        var games = JSON.parse(data)
        var game = req.headers.joincode
        var target = req.headers.target
        const username = req.headers.username
        if (games[game]['shooting_allowed'] || games[game]['no_shooting_player'] == username) {
            if (games[game]['shooting_count'] > 0) {
                games[game]['shooting_count']--
                games[game]['players'][target]['health'] -= 6
                if (!games[game]['safety_shield_played'] && Math.random() > .5) {
                    games[game]['players'][username]['health'] -= 5
                    logAction(`${username} has played big bomb against ${target} and took 5 damage`,game)
                }
                else {
                    logAction(`${username} has played big bomb against ${target}`,game)
                }
                games[game]['safety_shield_played'] = false
                const handIndex = games[game]['players'][username]['hand'].indexOf(parseInt(cardid))
                games[game]['players'][username]['hand'].splice(handIndex, 1)
                games = removeAllIfDead(games, game)
                games[game]["card_played_this_turn"] = true
                fs.writeFileSync('games.json', JSON.stringify(games, null, "\t"))
            }
        }
    })
}