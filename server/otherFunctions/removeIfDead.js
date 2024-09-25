const fs = require('fs')
module.exports = function (games, game, target) {
    if (games[game]['players'][target]['health'] <= 0) {
        fs.readFile('deck.json', 'utf8', (err, data) => {
            var deck = JSON.parse(data)
            var lastStandID=-1
            for(var i=0;i<deck.length;i++)if(deck[i]['id']=='last-stand')lastStandID=i
            console.log(lastStandID)
            if (lastStandID!=-1&&games[game]['players'][target]['hand'].includes(lastStandID)) {
                games[game]['players'][target]['health'] = 1
                const handIndex = games[game]['players'][username]['hand'].indexOf(lastStandID)
                games[game]['players'][username]['hand'].splice(handIndex, 1)
            }
            else {
                delete games[game]['players'][target]
                var currentPlayer = games[game]['order'][games[game]['turn']]
                if (currentPlayer != target) {
                    games[game]['order'].splice(games[game]['order'].indexOf(target))
                    games[game]['turn'] = games[game]['order'].indexOf(currentPlayer)
                }
            }
            return games
        })
    }
    else return games
}