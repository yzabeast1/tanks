const fs = require('fs')
module.exports = function (req, res,cardid) {
    fs.readFile('games.json', 'utf8', (err, data) => {
        const username=req.headers.username
        const game=req.headers.joincode
        var games=JSON.parse(data)
        games[game]['players'][username]['health']++
        const handIndex=games[game]['players'][username]['hand'].indexOf(cardid)
        games[game]['players'][username]['hand'].splice(handIndex,1)
        fs.writeFile('games.json', JSON.stringify(games, null, "\t"), function (err) { if (err) console.log(err) })
    })
}