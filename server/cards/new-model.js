const fs = require('fs')
module.exports = function (req, res, cardid) {
    fs.readFile('games.json', 'utf8', (err, data) => {
        fs.readFile('deck.json', 'utf8', (err1, data1) => {
            const username = req.headers.username
            const game = req.headers.joincode
            const discardone = req.headers.discardone
            const discardtwo = req.headers.discardtwo
            var games = JSON.parse(data)
            var deck = JSON.parse(data1)
            if (games[game]['event_count'] > 0) {
                if (deck[discardone]['type'] == 'shooting' && deck[discardtwo]['type'] == 'shooting') {
                    if (games[game]['players'][username]['health'] < 10) {
                        games[game]['players'][username]['health'] = 10
                        const handIndex = games[game]['players'][username]['hand'].indexOf(cardid)
                        games[game]['players'][username]['hand'].splice(handIndex, 1)
                        const discardOneIndex = games[game]['players'][username]['hand'].indexOf(discardone)
                        games[game]['players'][username]['hand'].splice(discardOneIndex, 1)
                        const discardTwoIndex = games[game]['players'][username]['hand'].indexOf(discardtwo)
                        games[game]['players'][username]['hand'].splice(discardTwoIndex, 1)
                        games[game]["card_played_this_turn"] = true
                        games[game]['event_count']--
                        fs.writeFile('games.json', JSON.stringify(games, null, "\t"), function (err) { if (err) console.log(err) })
                    }
                }
            }
        })
    })
}