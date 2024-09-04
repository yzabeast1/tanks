const fs=require('fs')
module.exports = function (req, res, cardid) {
    fs.readFile('games.json', 'utf8', (err, data) => {
        var games = JSON.parse(data)
        const game = req.headers.joincode
        const target = req.headers.target
        const username = req.headers.username
        const targetCard=req.headers.targetCard
        const handIndex = games[game]['players'][username]['hand'].indexOf(cardid)
        games[game]['players'][username]['hand'].splice(handIndex, 1)
        const targetIndex = games[game]['players'][target]['queued_cards'].indexOf(targetCard)
        games[game]['players'][target]['queued_cards'].splice(targetIndex, 1)
        games[game]["card_played_this_turn"]=true
        fs.writeFile('games.json', JSON.stringify(games, null, "\t"), function (err) { if (err) console.log(err) })
    })
}