const fs = require('fs')
const logAction=require('../otherFunctions/logAction.js')
module.exports = function (games, game, target) {
    if (games[game]['players'][target]['health'] <= 0) {
        try {
            const data = fs.readFileSync('deck.json', 'utf8')
            console.log('loaded')
            var deck = JSON.parse(data)
            var lastStandID = -1
            console.log(lastStandID)
            for (var i = 0; i < deck.length; i++) {
                if (deck[i]['id'] == 'last-stand') lastStandID = i
            }
            console.log(lastStandID)
            if (lastStandID != -1 && games[game]['players'][target]['hand'].includes(lastStandID)) {
                games[game]['players'][target]['health'] = 1
                const handIndex = games[game]['players'][target]['hand'].indexOf(lastStandID) // changed 'username' to 'target'
                games[game]['players'][target]['hand'].splice(handIndex, 1)
                logAction(`${target} was saved by last stand`,game)
            } else {
                delete games[game]['players'][target]
                var currentPlayer = games[game]['order'][games[game]['turn']]
                if (currentPlayer != target) {
                    games[game]['order'].splice(games[game]['order'].indexOf(target), 1)
                    games[game]['turn'] = games[game]['order'].indexOf(currentPlayer)
                }
                logAction(`${target} was killed`,game)
            }
        } catch (err) {
            console.error("Error reading deck.json:", err)
        }

        return games
    } else {
        console.log('tests1')
        return games
    }
}