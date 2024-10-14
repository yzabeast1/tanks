const fs = require('fs')
const logAction = require('../otherFunctions/logAction.js')
const removeIfDead = require("../otherFunctions/removeIfDead.js")
module.exports = function (req, res) {
    var games = JSON.parse(fs.readFileSync('games.json', 'utf8'))
    var game = req.headers.joincode
    var username = req.headers.username
    var target = req.headers.target
    var cardid = req.headers.cardid
    var cardIndex=-1
    for(var i=0;i<games[game]['players'][username]['queued_cards'].length;i++)if(games[game]['players'][username]['queued_cards'][i]['cardid']==cardid)cardIndex=i
    if(cardIndex!=-1){
    	if (games[game]['players'][username]['queued_cards'][cardIndex]['countdown'] == 0) {
        	logAction(`${games[game]['players'][username]['queued_cards'][cardIndex]['name']} was used against ${target}`, game)
        	games[game]['players'][target]['health'] -= games[game]['players'][username]['queued_cards'][cardIndex]['damage']
        	games = removeIfDead(games, game, target)
            games[game]['players'][username]['queued_cards'].splice(cardIndex, 1);
        	fs.writeFileSync('games.json', JSON.stringify(games, null, "\t"))
    	}
	}
}
