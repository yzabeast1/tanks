const fs = require('fs')
module.exports = function (req, res, cardid) {
    fs.readFile('games.json', 'utf8', (err, data) => {
        var games = JSON.parse(data)
        const game = req.headers.joincode
        const username = req.headers.username
        if (games[game]['event_count'] > 0) {
            games[game]['event_count']--
            games[game]['shooting_count']++
            const handIndex = games[game]['players'][username]['hand'].indexOf(cardid)
            games[game]['players'][username]['hand'].splice(handIndex, 1)
            fs.writeFile('games.json', JSON.stringify(games, null, "\t"), function (err) { if (err) console.log(err) })
        }
    })
}