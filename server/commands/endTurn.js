fs = require('fs')
module.exports = function endTurn(req, res) {
    var game = req.headers.joincode
    var player = req.headers.username
    fs.readFile('games.json', 'utf8', (err, data) => {
        var games = JSON.parse(data)
        if (player == games[game]['order'][games[game]['turn']]) {
            if (games[game]['turn'] == games[game]['order'].length - 1) games[game]['turn'] = 0
            else games[game]['turn']++
            console.log(games[game]['turn'])
            games[game]['players'][games[game]['order'][games[game]['turn']]]['hand'].push(games[game]['draw_pile'][0])
            games[game]['draw_pile'].splice(0,1)
            fs.writeFile('games.json', JSON.stringify(games, null, "\t"), function (err) { if (err) console.log(err) })
        }
    })
}