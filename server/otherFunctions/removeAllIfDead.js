const removeIfDead = require("./removeIfDead.js")

module.exports = function (games, game) {
	if (games[game] && games[game]['players']) {
		var players = games[game]['order']
		for (var i = 0; i < players.length; i++) {
			removeIfDead(games, game, players[i])
		}
	}
	return games
}