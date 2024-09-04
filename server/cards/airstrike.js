const fs = require('fs')
const removeIfDead = require("./otherFunctions/removeIfDead.js")
module.exports = function (req, res, cardid) {
    fs.readFile('games.json', 'utf8', (err, data) => {
        const username = req.headers.username
        const game = req.headers.joincode
        const target = req.headers.target
        const games = JSON.parse(data)
        games[game]['players'][target]['hand'] = []
        games[game]['players'][username]['health'] -= 3
        const handIndex = games[game]['players'][username]['hand'].indexOf(cardid)
        games[game]['players'][username]['hand'].splice(handIndex, 1)
        games = removeIfDead(games, game, target)
        games[game]["card_played_this_turn"] = true
        fs.writeFile('games.json', JSON.stringify(games, null, "\t"), function (err) { if (err) console.log(err) })
    })
}