module.exports = function gameState(req, res) {
    joincode = req.headers.joincode
    username = req.headers.username
    fs.readFile('games.json', 'utf8', (err, data) => {
        var games = JSON.parse(data)
        if (games[joincode] != null) {
            var game = games[joincode]
            delete game['draw_pile']
            for (var i = 0; i < game.order.length; i++) {
                if (game.order[i] != username) {
                    var temp = []
                    for (var j = 0; j < game.players[game.order[i]]['hand'].length; j++) {
                        temp.push(-1)
                    }
                    game.players[game.order[i]].hand = temp
                }
            }
            res.end(JSON.stringify(game))
        }
        res.end()
    })
}