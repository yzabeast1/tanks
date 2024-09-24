const fs = require('fs')
const endTurn = require("../commands/endTurn.js")
module.exports = function (req, res, cardid) {
    fs.readFile('games.json', 'utf8', (err, data) => {
        const username = req.headers.username
        const game = req.headers.joincode
        var games = JSON.parse(data)
        if (!games[game]["card_played_this_turn"]) {
            games[game]['players'][username]['hand'].push(games[game]['draw_pile'][0])
            games[game]['players'][username]['hand'].push(games[game]['draw_pile'][1])
            games[game]['players'][username]['hand'].push(games[game]['draw_pile'][2])
            games[game]['players'][username]['hand'].push(games[game]['draw_pile'][3])
            games[game]['players'][username]['hand'].push(games[game]['draw_pile'][4])
            games[game]['draw_pile'].splice(0, 5)
            const handIndex = games[game]['players'][username]['hand'].indexOf(parseInt(cardid))
            games[game]['players'][username]['hand'].splice(handIndex, 1)
            fs.writeFile('games.json', JSON.stringify(games, null, "\t"), function (err) { if (err) console.log(err) })
            endTurn(req,res)
        }
    })
}