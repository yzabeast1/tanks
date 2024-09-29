const fs = require('fs')
const logAction=require('../otherFunctions/logAction.js')
module.exports = function (req, res, cardid) {
    fs.readFile('games.json', 'utf8', (err, data) => {
        var games = JSON.parse(data)
        const game = req.headers.joincode
        const username = req.headers.username
        if (games[game]['shooting_allowed'] || games[game]['no_shooting_player'] == username) {
            if (games[game]['event_count'] > 0) {
                games[game]['event_count']--
                games[game]['shooting_count']++
                const handIndex = games[game]['players'][username]['hand'].indexOf(parseInt(cardid))
                games[game]['players'][username]['hand'].splice(handIndex, 1)
                fs.writeFileSync('games.json', JSON.stringify(games, null, "\t"))
                logAction(`${username} has played more ammo`,game)
            }
        }
    })
}