const fs = require("fs")
module.exports = function startGame(req, res) {
    fs.readFile('games.json', 'utf8', (err, data) => {
        fs.readFile('gameLobbies.json', 'utf8', (err1, data1) => {
            fs.readFile('deck.json', 'utf8', (err2, data2) => {
                var lobbies = JSON.parse(data1);
                if (data == null) data = "{}";
                if (data == "") data = "{}";
                var games = JSON.parse(data);
                var game = req.headers.joincode;
                var players = lobbies[game];
                var newGame = JSON.parse(`{
                    "turn":0,
                    "shooting_count":1,
                    "event_count":1,
                    "shooting_allowed":true,
                    "no_shooting_player":"0",
                    "card_played_this_turn":false,
                    "order":["${players.join('","')}"],
                    "players":{},
                    "draw_pile":[]
                }`);
                newGame["draw_pile"] = shuffle(Array.from({ length: JSON.parse(data2).length }, (_, i) => i + 1))
                for (var i = 0; i < players.length; i++) {
                    var makePlayer = JSON.parse(`{
                        "health":10,
                        "hand":[],
                        "queued_cards":[]
                    }`);
                    makePlayer.hand=newGame['draw_pile'].slice(i*4,(i+1)*4)
                    newGame['players'][players[i]] = makePlayer;
                }
                newGame['draw_pile'].splice(0,players.length*4)
                games[game] = newGame;
                fs.writeFile('games.json', JSON.stringify(games, null, "\t"), function (err) { if (err) console.log(err); });
                console.log(`A new game has been started with ${players}`);
                delete lobbies[game];
                // fs.writeFile('gameLobbies,json',JSON.stringify(lobbies,null,"\t"),function(err){if(err)console.log(err)})
                res.status(200).send('Game Started');
            });
        });
    });
} // joincode

function shuffle(array) {
    let currentIndex = array.length;

    // While there remain elements to shuffle...
    while (currentIndex != 0) {

        // Pick a remaining element...
        let randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;

        // And swap it with the current element.
        [array[currentIndex], array[randomIndex]] = [
            array[randomIndex], array[currentIndex]];
    }
    return array
}