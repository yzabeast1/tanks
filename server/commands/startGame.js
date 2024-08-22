const fs=require("fs")
module.exports=function startGame(req, res) {
    fs.readFile('games.json', 'utf8', (err, data) => {
        fs.readFile('gameLobbies.json', 'utf8', (err1, data1) => {
            var lobbies = JSON.parse(data1);
            if (data == null) data = "{}";
            if (data == "") data = "{}";
            var games = JSON.parse(data);
            var game = req.headers.joincode;
            var players = lobbies[game];
            var newGame = JSON.parse(`{
                "turn":0,
                "shot_count":1,
                "event_count":1,
                "shooting_allowed":true,
                "no_shooting_player":"0",
                "order":["${players.join('","')}"],
                "players":{}
            }`);
            for (var i = 0; i < players.length; i++) {
                var makePlayer = JSON.parse(`{
                    "health":10,
                    "hand":[],
                    "queued_cards":[]
                }`);
                newGame['players'][players[i]] = makePlayer;
            }
            games[game] = newGame;
            fs.writeFile('games.json', JSON.stringify(games, null, "\t"), function (err) { if (err) console.log(err); });
            console.log(`A new game has been started with ${players}`);
            delete lobbies[game];
            console.log(lobbies);
            // fs.writeFile('gameLobbies,json',JSON.stringify(lobbies,null,"\t"),function(err){if(err)console.log(err)})
            res.status(200).send('Game Started');
        });
    });
} // joincode
