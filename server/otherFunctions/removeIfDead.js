const lastStandID=17
module.exports = function (games, game, target) {
    if (games[game]['players'][target]['health'] <= 0)
        if (games[game]['players'][target]['hand'].includes(lastStandID)) {
            games[game]['players'][target]['health'] = 1
            const handIndex = games[game]['players'][username]['hand'].indexOf(lastStandID)
            games[game]['players'][username]['hand'].splice(handIndex, 1)
        }
        else delete games[game]['players'][target]
    return games
}