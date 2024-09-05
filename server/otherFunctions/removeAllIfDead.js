const lastStandID = 17
module.exports = function (games, game) {
	if (games[game] && games[game].players) {
		const players = games[game].players;
		for (const player in players) {
			if (players[player].health <= 0) {
				if (players[player]['hand'].includes(lastStandID)) {
					players[player]['health'] = 1
					const handIndex = playerss[player]['hand'].indexOf(lastStandID)
					players[player]['hand'].splice(handIndex, 1)
				}
				else delete players[player];
			}
		}
	}
	return games;
}