const fs = require('fs')
module.exports = function (req, res, cardid) {
    fs.readFile('games.json', 'utf8', (err, data) => {
        var games = JSON.parse(data)
        const game = req.headers.joincode
        const target = req.headers.target
        const username = req.headers.username
        const targetCard = req.headers.targetCard
        if (games[game]['shooting_allowed'] || games[game]['no_shooting_player'] == username) {
            if (games[game]['shooting_count'] > 0) {
                var cardIndex = -1
                for (var i = 0; i < games[game]['players'][username]['queued_cards'].length; i++)if (games[game]['players'][username]['queued_cards'][i]['cardid'] == cardid) cardIndex = i
                if (cardIndex != -1) {
                    games[game]['shooting_count']--
                    const handIndex = games[game]['players'][username]['hand'].indexOf(parseInt(cardid))
                    games[game]['players'][username]['hand'].splice(handIndex, 1)
                    games[game]['players'][target]['queued_cards'].splice(cardIndex, 1)
                    games[game]["card_played_this_turn"] = true
                    fs.writeFileSync('games.json', JSON.stringify(games, null, "\t"))
                }
            }
        }
    })
}