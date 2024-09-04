module.exports=function(games,game){
	if (games[game] && games[game].players) {
		const players = games[game].players;
		for (const player in players) {
			if (players[player].health === 0) {
				delete players[player];
			}
		}
	}
	return games;
}