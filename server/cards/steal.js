const fs = require('fs')
const logAction = require('../otherFunctions/logAction.js')
module.exports = function (req, res, cardid) {
    fs.readFile('games.json', 'utf8', (err, data) => {
        var games = JSON.parse(data)
        const game = req.headers.joincode
        const target = req.headers.target
        const username = req.headers.username
        const handSize = games[game]['players'][target]['hand'].length
        if (handSize > 0) {
            const cardToSteal = Math.floor(Math.random() * handSize)
            games[game]['players'][username]['hand'].push(games[game]['players'][target]['hand'][cardToSteal])
            games[game]['players'][target]['hand'].splice(cardToSteal, 1)
            const handIndex = games[game]['players'][username]['hand'].indexOf(parseInt(cardid))
            games[game]['players'][username]['hand'].splice(handIndex, 1)
            games[game]["card_played_this_turn"] = true
            fs.writeFileSync('games.json', JSON.stringify(games, null, "\t"))
            logAction(`${username} has played steal against ${target}`, game)
        }
    })
}