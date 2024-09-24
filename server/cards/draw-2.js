const fs = require('fs')
module.exports = function (req, res, cardid) {
    fs.readFile('games.json', 'utf8', (err, data) => {
        const username = req.headers.username
        const game = req.headers.joincode
        var games=JSON.parse(data)
        games[game]['players'][username]['hand'].push(games[game]['draw_pile'][0])
        games[game]['players'][username]['hand'].push(games[game]['draw_pile'][1])
        games[game]['draw_pile'].splice(0,2)
        const handIndex = games[game]['players'][username]['hand'].indexOf(parseInt(cardid))
        games[game]['players'][username]['hand'].splice(handIndex, 1)
        games[game]["card_played_this_turn"]=true
        fs.writeFile('games.json', JSON.stringify(games, null, "\t"), function (err) { if (err) console.log(err) })
    })
}