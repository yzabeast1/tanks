fs = require('fs')
const removeIfDead = require("../otherFunctions/removeIfDead.js")
module.exports = function endTurn(req, res) {
    var game = req.headers.joincode
    var username = req.headers.username
    fs.readFile('games.json', 'utf8', (err, data) => {
        var games = JSON.parse(data)
        if(username==games[game]['order'][games[game]['turn']]){
            if (games[game]['turn'] == games[game]['order'].length - 1) games[game]['turn'] = 0
            else games[game]['turn']++
            console.log(games[game]['turn'])
            const newPlayerName=games[game]['order'][games[game]['turn']]
            games[game]['players'][newPlayerName]['hand'].push(games[game]['draw_pile'][0])
            games[game]['draw_pile'].splice(0,1)
            games[game]['card_played_this_turn']=false
            games[game]['shooting_count']=1
            games[game]['event_count']=1
            if(games[game]['landmine_in_play']){
                if(Math.random()>.5){
                    games[game]['landmine_in_play']=false
                    games[game]['players'][newPlayerName]['health']-=6
                    removeIfDead(games,game,newPlayerName)
                }
            }
            games[game]['safety_shield_played']=false
            if(!games[game]['shooting_allowed']&&games[game]['no_shooting_player']==newPlayerName)games[game]['shooting_allowed']=true
            fs.writeFile('games.json', JSON.stringify(games, null, "\t"), function (err) { if (err) console.log(err) })
            res.end()
        }
        res.end()
    })
}