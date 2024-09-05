fs = require('fs')
const removeIfDead=require('./otherFunctions/removeIfDead.js')
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
            games[game]['card_played_this_turn']=false
            games[game]['shooting_count']=1
            games[game]['event_count']=1
            if(games[game]['landmine_in_play']){
                if(Math.random()>.5){
                    games[game]['landmine_in_play']=false
                    games[game]['players'][games[game]['order'][games[game]['turn']]]['health']-=6
                    removeIfDead(games,game,games[game]['order'][games[game]['turn']])
                }
            }
            fs.writeFile('games.json', JSON.stringify(games, null, "\t"), function (err) { if (err) console.log(err) })
        }
    })
}